import { describe, it, expect, vi, afterEach } from 'vitest';

import { extractTikTokUsername, fetchTikTokProfileVideos } from '../src/faizan.js';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('extractTikTokUsername', () => {
  it('takes a bare username', () => {
    expect(extractTikTokUsername('tiktok')).toBe('tiktok');
    expect(extractTikTokUsername('khaby.lame')).toBe('khaby.lame');
  });

  it('strips a leading @', () => {
    expect(extractTikTokUsername('@tiktok')).toBe('tiktok');
  });

  it('extracts the username from a full profile URL', () => {
    expect(extractTikTokUsername('https://www.tiktok.com/@tiktok')).toBe('tiktok');
    expect(extractTikTokUsername('https://www.tiktok.com/@khaby.lame?lang=en')).toBe('khaby.lame');
    expect(extractTikTokUsername('https://tiktok.com/@tiktok/video/123')).toBe('tiktok');
  });

  it('returns empty for unusable input', () => {
    expect(extractTikTokUsername('')).toBe('');
    expect(extractTikTokUsername('   ')).toBe('');
    expect(extractTikTokUsername('https://www.tiktok.com/')).toBe('');
    expect(extractTikTokUsername('not a username!')).toBe('');
    expect(extractTikTokUsername(null)).toBe('');
  });
});

const profileApiFixture = () => ({
  success: true,
  query: 'prince_faizee',
  user: {
    username: 'prince_faizee',
    nickname: 'Faizan Ahmad Khichi',
    verified: false,
    bio: 'Founder @ FAK LABS',
    avatar: 'https://cdn.example/avatar.jpg',
    stats: { followers: 819, following: 0, likes: 55, videos: 8, friends: 4 },
    privateAccount: false,
  },
  videos: [
    {
      id: '7708437799829114133',
      url: 'https://www.tiktok.com/@prince_faizee/video/7708437799829114133',
      desc: 'Free X API.',
      cover: 'https://cdn.example/cover.jpg',
      duration: 6,
      created: 1794760540,
      stats: { plays: 90, likes: 2, comments: 0, shares: 0 },
      downloadUrl: 'https://v45.tiktokcdn-eu.com/example.mp4',
      playUrl: 'https://v45.tiktokcdn-eu.com/example.mp4',
    },
  ],
  total: 1,
  hasMore: false,
  cursor: null,
});

function mockFetch(body, status = 200) {
  const fn = vi.fn(async () => ({
    status,
    ok: status >= 200 && status < 300,
    json: async () => body,
  }));
  vi.stubGlobal('fetch', fn);
  return fn;
}

describe('fetchTikTokProfileVideos', () => {
  it('normalizes the profile + videos into Snatcher shape', async () => {
    mockFetch(profileApiFixture());
    const out = await fetchTikTokProfileVideos('prince_faizee');
    expect(out.user.username).toBe('prince_faizee');
    expect(out.user.nickname).toBe('Faizan Ahmad Khichi');
    expect(out.user.followers).toBe(819);
    expect(out.user.videoCount).toBe(8);
    expect(out.videos).toHaveLength(1);
    expect(out.videos[0].id).toBe('7708437799829114133');
    expect(out.videos[0].downloadUrl).toBe('https://v45.tiktokcdn-eu.com/example.mp4');
    expect(out.videos[0].plays).toBe(90);
    expect(out.total).toBe(1);
    expect(out.hasMore).toBe(false);
    expect(out.cursor).toBeNull();
  });

  it('accepts a full profile URL as the username', async () => {
    const fetchMock = mockFetch(profileApiFixture());
    await fetchTikTokProfileVideos('https://www.tiktok.com/@prince_faizee');
    const calledUrl = fetchMock.mock.calls[0][0];
    expect(calledUrl).toContain('/videos?u=prince_faizee');
  });

  it('clamps limit to 1–90 and passes the cursor through', async () => {
    const fetchMock = mockFetch(profileApiFixture());
    await fetchTikTokProfileVideos('tiktok', { limit: 500, cursor: '12345' });
    const calledUrl = fetchMock.mock.calls[0][0];
    expect(calledUrl).toContain('limit=90');
    expect(calledUrl).toContain('cursor=12345');
  });

  it('throws link_not_found when the profile does not exist', async () => {
    mockFetch({ success: false, error: 'User not found' }, 404);
    await expect(fetchTikTokProfileVideos('no_such_user_xyz')).rejects.toMatchObject({
      code: 'link_not_found',
      status: 404,
    });
  });

  it('throws invalid_url for an empty username', async () => {
    await expect(fetchTikTokProfileVideos('')).rejects.toMatchObject({
      code: 'invalid_url',
      status: 400,
    });
  });

  it('throws upstream_error when the API fails', async () => {
    mockFetch({ success: false, error: 'bad gateway' }, 502);
    await expect(fetchTikTokProfileVideos('tiktok')).rejects.toMatchObject({
      code: 'upstream_error',
      status: 502,
    });
  });
});
