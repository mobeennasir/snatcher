'use strict';

// SEO content for the home and platform pages. The visible copy and the
// FAQPage JSON-LD are built from the same FAQ arrays, so what Google reads
// is exactly what the visitor sees. Written for a human who landed from
// search: what the tool does, what it returns, what it does not do.

const PLATFORM_CONTENT = {
  instagram: {
    about: [
      'Instagram is where most of the videos and photos worth keeping live — reels, single posts, and carousels. Snatcher reads the link you paste and pulls out every photo and video inside it, so you can save the exact file instead of a screen recording. A reel gives you its video. A single post gives you its photo or video. A carousel gives you everything in it, each file on its own, so you pick the ones you want.',
      'The files come down at the quality Instagram serves them — the same resolution as the original post, with no extra compression and no watermark added by Snatcher. Instagram does not watermark its own posts, so what you save is what was posted. Captions are shown alongside the media, and you can copy the caption text with one tap.',
    ],
    formats:
      'Videos save as MP4 and photos as JPG or PNG, in the original quality. Carousels are split into individual files, each named from the post\u2019s caption so you can tell them apart later.',
    faq: [
      {
        q: 'Can I download Instagram reels?',
        a: 'Yes. Paste any reel link and Snatcher gives you the reel\u2019s video as an MP4. Reels, single posts and carousels all work the same way.',
      },
      {
        q: 'Does it work with carousel posts?',
        a: 'Yes. A carousel post returns every photo and video inside it as separate files, so you can download all of them or just the ones you want.',
      },
      {
        q: 'Do I need an Instagram account?',
        a: 'No. Snatcher needs only the link. You do not sign in, install an app, or create an account to download.',
      },
      {
        q: 'Is the quality the same as the original?',
        a: 'Yes. Snatcher saves the file at the quality Instagram serves, with no re-compression. What you download is the same file Instagram shows.',
      },
    ],
  },

  tiktok: {
    about: [
      'TikTok videos are short, and the watermark makes them hard to reuse. Snatcher downloads TikTok videos without the watermark — paste any TikTok link and save the clean MP4 in one click. The video comes down in the best quality TikTok serves, and the audio is available separately as an MP3, so you can keep the sound without the video.',
      'It works with any public TikTok video: clips from creators, sounds, and duets. Private videos and videos from private accounts cannot be downloaded, because TikTok does not serve them to anyone who is not logged in as an approved follower.',
    ],
    formats:
      'Videos save as MP4 without the watermark. The audio track saves as a separate MP3 when it is available. Files are named from the video\u2019s caption when it has one.',
    faq: [
      {
        q: 'Can I download TikTok videos without the watermark?',
        a: 'Yes. That is the point of the TikTok downloader — the video saves clean, with no TikTok logo bouncing around the frame.',
      },
      {
        q: 'Can I download just the audio?',
        a: 'Yes. When a TikTok video has a music track, Snatcher lists it as a separate audio file you can download as an MP3.',
      },
      {
        q: 'Does it work with private TikTok videos?',
        a: 'No. Private videos are only visible to approved followers, so they cannot be fetched. Only public videos work.',
      },
      {
        q: 'Do I need the TikTok app?',
        a: 'No. You only need the video link. Paste it here and download — no app, no account, no sign-in.',
      },
      {
        q: 'Can I download all videos from a TikTok profile?',
        a: 'Yes. Switch to Profile on the TikTok page, enter a username, and Snatcher lists that creator\u2019s public videos with a download link on each one. Copy all the links at once, or download videos one by one.',
      },
    ],
  },

  facebook: {
    about: [
      'Facebook videos live in posts, reels, and Watch, and Facebook makes them awkward to save. Snatcher takes a Facebook link and returns the video as an MP4 you can keep. It works with videos from public posts, reels, and Watch pages — the video you see is the video you get.',
      'The video downloads in the best quality Facebook serves for that post. Facebook sometimes serves more than one quality; Snatcher picks the best available so you do not have to choose. Captions are shown when the post has one.',
    ],
    formats:
      'Videos save as MP4 in the best available quality. The file is named from the post\u2019s caption when it has one, so it is easy to find later.',
    faq: [
      {
        q: 'Can I download Facebook reels?',
        a: 'Yes. Paste a reel link and Snatcher returns the reel\u2019s video as an MP4.',
      },
      {
        q: 'Does it work with Facebook Watch videos?',
        a: 'Yes. Videos from Watch pages work the same as videos from posts and reels.',
      },
      {
        q: 'Can I download videos from private Facebook posts?',
        a: 'No. Videos in private posts and closed groups are only visible to people with access, so they cannot be fetched. Only public posts work.',
      },
      {
        q: 'Do I need a Facebook account?',
        a: 'No. You only need the link to a public video. No sign-in and no account are required.',
      },
    ],
  },

  twitter: {
    about: [
      'Videos on X are easy to watch and hard to keep. Snatcher takes a post link and returns the video in the best quality X serves, as an MP4. Photo posts work too — every image in the post is listed as a separate file, so you can save the ones you want.',
      'X serves most videos in more than one quality. Snatcher picks the highest available, so the file you save is the sharpest version of the clip. Animated GIFs are treated as the short looping videos they really are, and they download as MP4s.',
    ],
    formats:
      'Videos and animated GIFs save as MP4 in the best available quality. Photos save as JPG in their original resolution. Files are named from the post\u2019s caption when it has one.',
    faq: [
      {
        q: 'Can I download videos from X?',
        a: 'Yes. Paste a post link with a video and Snatcher returns the video as an MP4 in the best quality available.',
      },
      {
        q: 'Can I download photos from a post?',
        a: 'Yes. Photo posts return every image as a separate file, so you can download all of them or just one.',
      },
      {
        q: 'What about GIFs?',
        a: 'X GIFs are short looping videos. Snatcher downloads them as MP4 files, which play the same way.',
      },
      {
        q: 'Does it work with posts from private accounts?',
        a: 'No. Posts from protected accounts are only visible to approved followers, so they cannot be fetched.',
      },
    ],
  },

  pinterest: {
    about: [
      'Pinterest is a board of images and short videos, and saving them one by one is slow. Snatcher takes a pin link and returns the photo or video inside it at full quality. Use the Photos / Videos switch to filter, or take everything the pin holds.',
      'Photos save in their original resolution, and videos save as MP4. Pinterest serves most pins as a single image or a single video, so what you get is the pin itself — not a thumbnail and not a compressed preview.',
    ],
    formats:
      'Photos save as JPG or PNG in their original resolution. Videos save as MP4. The Photos / Videos switch filters the results before you download.',
    faq: [
      {
        q: 'Can I download Pinterest videos?',
        a: 'Yes. Paste a video pin link and Snatcher returns the video as an MP4.',
      },
      {
        q: 'Can I download Pinterest photos?',
        a: 'Yes. Paste a pin link and Snatcher returns the photo at its original resolution.',
      },
      {
        q: 'What does the Photos / Videos switch do?',
        a: 'It filters the results. Choose Photos to see only images, Videos to see only videos, or All to see everything the pin holds.',
      },
      {
        q: 'Do I need a Pinterest account?',
        a: 'No. You only need the pin link. No sign-in and no account are required.',
      },
    ],
  },
};

const HOME_CONTENT = {
  about: [
    'Snatcher is a free downloader for Instagram, TikTok, Facebook, X, and Pinterest. Paste a link, and it pulls the photos and videos out of the post so you can save them as files. No account, no app to install, and no watermark added — the file you save is the file that was posted.',
    'It works in your browser on any device. Paste one link, or switch to Batch and paste up to ten links at once — each one is checked on its own, so one bad link never stops the rest. Nothing you download is stored on Snatcher\u2019s servers; the file goes straight from the platform to your device.',
  ],
  faq: [
    {
      q: 'Is Snatcher free?',
      a: 'Yes. Downloading is free, with no account and no limits on the number of links you can try.',
    },
    {
      q: 'Do I need to install an app?',
      a: 'No. Snatcher runs in your browser on any device — phone, tablet, or computer.',
    },
    {
      q: 'Which platforms does Snatcher support?',
      a: 'Instagram, TikTok, Facebook, X (Twitter), and Pinterest. YouTube is not supported.',
    },
    {
      q: 'Is my download stored anywhere?',
      a: 'No. Snatcher never stores the media you download. The file goes straight from the platform to your device, and the link is not kept.',
    },
  ],
};

// Build a schema.org FAQPage object from a faq array. The visible FAQ and
// the structured data come from the same source, so they can never drift.
function faqJsonLd(faq) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

module.exports = { PLATFORM_CONTENT, HOME_CONTENT, faqJsonLd };
