'use strict';

// Faizan Khichi's free FAK LABS APIs (no key, no login) — primary resolvers
// for TikTok and X/Twitter. The old btch-downloader + yt-dlp paths are KEPT
// as fallback in media.js, and v3.3.1 is saved on branch
// backup/pre-faizan-api-v3.3.1 if these APIs ever fail.
//
// TikTok docs: https://github.com/faizanahmadkhichi/tiktok-api
// X docs:      https://github.com/faizanahmadkhichi/x-api-docs
//
// Two rules from the TikTok docs that shape this module:
//  - Use video.directDownloadUrl / music.directDownloadUrl (the /dl links),
//    NOT the raw playUrl/downloadUrl (those need a session cookie).
//  - /dl is "direct access only — server-to-server proxying is not allowed"
//    (403). So TikTok items are marked direct:true and the BROWSER opens the
//    tt-api link itself; Snatcher's /dl proxy never fetches it.
// The X API has no such restriction, so X items go through /dl as usual.

const config = require('./config');
const logger = require('./logger');
const { Errors } = require('./errors');

const TT_API = 'https://tt-api.faizankhichi.me/';
const X_API = 'https://x-api.faizankhichi.me/';
// TikTok Profile Search API (FAK LABS) — list a creator's videos with a
// download link on each one. Docs: https://github.com/FAK-LABS/tiktok-profile-search-api
// The repo is documentation only (no server source), so this is a client of
// his hosted API, same as tt-api / x-api above — one constant to swap if
// the API ever moves. No key, CORS open.
// The downloadUrl is a raw TikTok CDN link (NOT a /dl proxy): the BROWSER
// downloads it directly, so the tt-api "no server-to-server proxying" rule
// does not apply. The CDN sends no CORS headers, so Snatcher's download
// loader falls back to a plain navigation for these links (see snatcher.js).
const PROFILE_API = 'https://tiktok-profile-api.faizankhichi.me/';

// A browser User-Agent: these APIs serve browsers, and a proxy-looking UA
// risks the 403 "server-to-server proxying" refusal on the TikTok /dl links.
const BROWSER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

// Fetch JSON with a timeout. Returns the parsed object, or throws.
async function fetchJson(base, postUrl, label) {
  const endpoint = `${base}?url=${encodeURIComponent(postUrl)}`;
  const res = await fetch(endpoint, {
    headers: { 'User-Agent': BROWSER_UA, Accept: 'application/json' },
    signal: AbortSignal.timeout(config.upstreamTimeoutMs),
  });
  if (!res.ok) {
    throw new Error(`${label} API returned HTTP ${res.status}`);
  }
  const data = await res.json();
  if (!data || data.success !== true) {
    throw new Error(`${label} API: ${(data && data.error) || 'post not found'}`);
  }
  return data;
}

// Probe a download URL with a 1-byte range request. Returns true when the
// host actually serves the file (200/206). The tt-api /dl link 502s for
// some videos ("TikTok didn't return the video data") — probing here lets
// the resolver fall back to yt-dlp/ttdl instead of handing the user a dead
// link. A failed probe never throws; it just returns false.
async function verifyUrl(url, label) {
  if (!url || typeof url !== 'string' || !url.startsWith('http')) return false;
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: { 'User-Agent': BROWSER_UA, Range: 'bytes=0-0' },
      signal: AbortSignal.timeout(10000),
    });
    const ok = res.status === 200 || res.status === 206;
    if (!ok) logger.warn({ status: res.status, label }, 'Faizan download URL probe failed');
    // Drain the tiny body so the socket closes cleanly.
    try { await res.arrayBuffer(); } catch { /* ignore */ }
    return ok;
  } catch (err) {
    logger.warn({ err: err.message, label }, 'Faizan download URL probe error');
    return false;
  }
}

// --- TikTok -----------------------------------------------------------------
// Returns { description, authorName, videoUrl, audioUrl, thumbnail, width,
// height, duration } or throws. videoUrl/audioUrl are the tt-api /dl links
// (browser-direct). description may be '' — the caller falls back to the old
// code for the caption in that case.
async function fetchTikTok(postUrl) {
  const d = await fetchJson(TT_API, postUrl, 'TikTok');
  const video = d.video || {};
  const music = d.music || {};
  const videoUrl = video.directDownloadUrl || video.directUrl || null;
  const audioUrl = music.directDownloadUrl || music.directUrl || null;
  if (!videoUrl) throw new Error('TikTok API: no video download link');
  const covers = video.covers || {};
  return {
    description: typeof d.description === 'string' ? d.description : '',
    authorName: (d.author && (d.author.nickname || d.author.uniqueId)) || '',
    videoUrl,
    audioUrl,
    thumbnail: covers.default || covers.origin || null,
    width: video.width || null,
    height: video.height || null,
    duration: video.duration || null,
  };
}

// --- X / Twitter ------------------------------------------------------------
// Returns { caption, mediaType, videoUrl, photoUrls, thumbnail, authorName }
// or throws. mediaType is 'photo' | 'video' | 'animated_gif' | 'text'.
// Photo posts return their images in `download` (all_thumbnails); text-only
// posts have no video_url. caption may be '' — caller falls back to old code.
async function fetchX(postUrl) {
  const d = await fetchJson(X_API, postUrl, 'X');
  const post = d.post || {};
  const dl = d.download || {};
  const mediaType = String(post.media_type || '').toLowerCase();
  const author = d.author || {};
  // Photos: the docs say photo posts return the images in `download`. The
  // image list lives in all_thumbnails (each entry is one photo); accept
  // the other plausible field names too, and dedupe by base URL.
  const photoCandidates = [
    ...(Array.isArray(dl.photos) ? dl.photos : []),
    ...(Array.isArray(dl.images) ? dl.images : []),
    ...(Array.isArray(dl.photo_urls) ? dl.photo_urls : []),
    ...(Array.isArray(dl.all_photos) ? dl.all_photos : []),
    ...(Array.isArray(dl.all_thumbnails) ? dl.all_thumbnails : []),
  ];
  const photoUrls = [];
  const seen = new Set();
  for (const entry of photoCandidates) {
    const u = typeof entry === 'string' ? entry : entry && entry.url;
    if (!u || typeof u !== 'string' || !u.startsWith('http')) continue;
    // all_thumbnails holds the same photo at several sizes (?name=small /
    // medium / large / orig). Keep the largest variant per photo: prefer
    // name=large or name=orig, else the .jpg original.
    const base = u.split('?')[0];
    if (seen.has(base)) continue;
    seen.add(base);
    photoUrls.push(u);
  }
  // Prefer the large/orig variant when several sizes of one photo exist.
  photoUrls.sort((a, b) => {
    const score = (u) => (u.includes('name=orig') ? 3 : u.includes('name=large') ? 2 : u.includes('name=medium') ? 1 : 0);
    return score(b) - score(a);
  });
  return {
    caption: typeof post.caption === 'string' ? post.caption : '',
    mediaType,
    videoUrl: typeof dl.video_url === 'string' ? dl.video_url : null,
    photoUrls,
    thumbnail: typeof dl.thumbnail_url === 'string' ? dl.thumbnail_url : null,
    authorName: author.username || author.full_name || '',
  };
}

// --- TikTok profile search + bulk download ----------------------------------
// Accept a bare username (@user, user) or a full tiktok.com/@user profile
// URL and return the plain username. Returns '' when nothing usable is in
// the input — the caller reports that as an invalid-URL error.
function extractTikTokUsername(input) {
  const raw = String(input || '').trim();
  if (!raw) return '';
  // Full profile URL: https://www.tiktok.com/@username — anything after the
  // username (?query, /video/...) is ignored.
  const m = raw.match(/tiktok\.com\/@([A-Za-z0-9._-]+)/i);
  if (m) return m[1];
  // Bare username, with or without the @.
  const name = raw.replace(/^@/, '').trim();
  return /^[A-Za-z0-9._-]+$/.test(name) ? name : '';
}

// GET a JSON path on the profile API. Throws a SnatcherError: 404 becomes
// link_not_found (no such profile), other bad statuses become upstream_error.
async function fetchProfileJson(path) {
  const res = await fetch(`${PROFILE_API}${path}`, {
    headers: { 'User-Agent': BROWSER_UA, Accept: 'application/json' },
    signal: AbortSignal.timeout(config.upstreamTimeoutMs),
  });
  if (res.status === 404) {
    throw Errors.linkNotFound('No TikTok profile found for that username.');
  }
  if (!res.ok) {
    throw Errors.upstreamError(`TikTok profile service returned HTTP ${res.status}.`);
  }
  const data = await res.json();
  if (!data || data.success !== true) {
    throw Errors.upstreamError((data && data.error) || 'TikTok profile service failed.');
  }
  return data;
}

// List one page of a TikTok profile's videos, with the profile attached.
// Returns { user, videos, total, hasMore, cursor } where each video is
// { id, url, desc, cover, duration, created, plays, likes, comments,
//   shares, downloadUrl }. limit is clamped to 1–90 (API default 30).
async function fetchTikTokProfileVideos(username, { limit = 30, cursor = null } = {}) {
  const name = extractTikTokUsername(username);
  if (!name) throw Errors.invalidUrl('Enter a TikTok username, like @tiktok.');
  const n = Math.max(1, Math.min(90, parseInt(limit, 10) || 30));
  // No leading slash: PROFILE_API already ends with one, and a double
  // slash (//videos) makes the API answer 404.
  const qs =
    `videos?u=${encodeURIComponent(name)}&limit=${n}` +
    (cursor ? `&cursor=${encodeURIComponent(cursor)}` : '');
  const d = await fetchProfileJson(qs);
  const user = d.user || {};
  const stats = user.stats || {};
  const videos = (Array.isArray(d.videos) ? d.videos : []).map((v) => {
    const s = v.stats || {};
    return {
      id: String(v.id || ''),
      url: typeof v.url === 'string' ? v.url : null,
      desc: typeof v.desc === 'string' ? v.desc : '',
      cover: typeof v.cover === 'string' ? v.cover : null,
      duration: typeof v.duration === 'number' ? v.duration : null,
      created: typeof v.created === 'number' ? v.created : null,
      plays: typeof s.plays === 'number' ? s.plays : null,
      likes: typeof s.likes === 'number' ? s.likes : null,
      comments: typeof s.comments === 'number' ? s.comments : null,
      shares: typeof s.shares === 'number' ? s.shares : null,
      downloadUrl: typeof v.downloadUrl === 'string' ? v.downloadUrl : null,
    };
  });
  return {
    user: {
      username: typeof user.username === 'string' ? user.username : name,
      nickname: typeof user.nickname === 'string' ? user.nickname : '',
      bio: typeof user.bio === 'string' ? user.bio : '',
      verified: user.verified === true,
      avatar: typeof user.avatar === 'string' ? user.avatar : null,
      followers: typeof stats.followers === 'number' ? stats.followers : null,
      following: typeof stats.following === 'number' ? stats.following : null,
      likes: typeof stats.likes === 'number' ? stats.likes : null,
      videoCount: typeof stats.videos === 'number' ? stats.videos : null,
      privateAccount: user.privateAccount === true,
    },
    videos,
    total: typeof d.total === 'number' ? d.total : videos.length,
    hasMore: d.hasMore === true,
    cursor:
      typeof d.cursor === 'string' || typeof d.cursor === 'number' ? String(d.cursor) : null,
  };
}

module.exports = { fetchTikTok, fetchX, verifyUrl, extractTikTokUsername, fetchTikTokProfileVideos };
