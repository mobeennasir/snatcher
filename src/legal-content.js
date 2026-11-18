'use strict';

// Content for the four legal/info pages. Each page is a title, a meta
// description, an intro, and sections of paragraphs and bullets. The
// strings are written by the site owner and rendered unescaped in legal.ejs.

const CONTACT_EMAIL = 'mubeennasir117@gmail.com';
const CONTACT_WHATSAPP = 'https://wa.me/923136701631';

const LEGAL_PAGES = {
  privacy: {
    title: 'Privacy Policy',
    description:
      'How Snatcher handles your data: no accounts, no tracking cookies, no stored downloads. Read what is collected and what is not.',
    intro:
      'Snatcher is built to collect as little as possible. This policy explains what is collected, what is not, and why.',
    sections: [
      {
        heading: 'What Snatcher collects',
        paragraphs: [
          'Snatcher does not ask you to create an account, sign in, or give a name or email address to download. The link you paste is used once to find the media in that post, and it is not stored.',
          'The server keeps a short request log — the page requested, the result, and how long it took — so errors can be found and fixed. The log never records the link you pasted or the contents of a request.',
        ],
      },
      {
        heading: 'What Snatcher does not collect',
        paragraphs: [
          'No account details, no browsing history, no device identifiers, and no media files. Snatcher never stores the photos or videos you download; they go straight from the platform to your device.',
        ],
      },
      {
        heading: 'Cookies',
        paragraphs: [
          'Snatcher does not set tracking cookies of its own. If advertising is ever added, the ad provider may set cookies — see the advertising section below.',
        ],
      },
      {
        heading: 'Advertising and cookies',
        paragraphs: [
          'Google and other third-party vendors may use cookies to serve ads on this site. Google\u2019s use of advertising cookies enables it and its partners to serve ads based on your visits to this site and other sites on the internet.',
          'You can opt out of personalised advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener">Google Ads Settings</a>. You can also opt out of a third-party vendor\u2019s use of cookies for personalised advertising by visiting <a href="https://www.aboutads.info/choices" target="_blank" rel="noopener">www.aboutads.info/choices</a>.',
        ],
      },
      {
        heading: 'Third-party services',
        paragraphs: [
          'To find the media in a link, Snatcher contacts the platform that hosts the post (Instagram, TikTok, Facebook, X, or Pinterest) and, for some platforms, a third-party download service. Those services may log the request under their own privacy policies.',
        ],
      },
      {
        heading: 'Contact',
        paragraphs: [
          `Questions about this policy: write to <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>.`,
        ],
      },
    ],
  },

  terms: {
    title: 'Terms of Service',
    description:
      'The rules for using Snatcher: only download media you own or have the right to keep, and how copyright takedowns work.',
    intro: 'By using Snatcher you agree to these terms. They are short on purpose.',
    sections: [
      {
        heading: 'Lawful use',
        paragraphs: [
          'Only download media you own or have the right to keep. Do not use Snatcher to download someone else\u2019s work without their permission, and do not use it to infringe copyright. You are responsible for how you use the files you download.',
        ],
      },
      {
        heading: 'What Snatcher does',
        paragraphs: [
          'Snatcher finds the media inside a public post link and gives you a way to save it. It does not host any media, it does not store your downloads, and it does not work with YouTube.',
        ],
      },
      {
        heading: 'Copyright and takedowns (DMCA)',
        paragraphs: [
          `Snatcher respects copyright. If you are a copyright owner and a link on this site points to media that infringes your work, send a takedown notice to <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a> with:`,
        ],
        bullets: [
          'Identification of the copyrighted work.',
          'The link to the infringing material.',
          'Your contact information.',
          'A statement that you believe in good faith the use is not authorised.',
          'A statement, under penalty of perjury, that the information in the notice is accurate and you are authorised to act for the copyright owner.',
        ],
      },
      {
        heading: 'After a takedown notice',
        paragraphs: [
          'Snatcher will block the reported link promptly. Because Snatcher does not host media, a takedown removes the link from the service rather than deleting a file.',
        ],
      },
      {
        heading: 'No warranty',
        paragraphs: [
          'Snatcher is provided as is, without any warranty. Links break, platforms change, and downloads sometimes fail. Snatcher is not liable for any file you download or any use you make of it.',
        ],
      },
      {
        heading: 'Changes',
        paragraphs: ['These terms may change. The current version is always the one on this page.'],
      },
    ],
  },

  about: {
    title: 'About Snatcher',
    description:
      'What Snatcher is: a free downloader for Instagram, TikTok, Facebook, X and Pinterest. No account, no app, nothing stored.',
    intro:
      'Snatcher is a small, free tool that saves the photos and videos from a social media post as files on your device.',
    sections: [
      {
        heading: 'What it does',
        paragraphs: [
          'Paste a link from Instagram, TikTok, Facebook, X, or Pinterest. Snatcher reads the post, lists the media inside it, and lets you download each file. TikTok videos come down without the watermark, and the audio is available separately.',
        ],
      },
      {
        heading: 'How it works',
        paragraphs: [
          'Snatcher resolves the link on its own server, then hands your browser a signed download link. The file streams from the platform to your device — Snatcher never stores it, and the link expires. There is no account, no app, and nothing to install.',
        ],
      },
      {
        heading: 'What it does not do',
        paragraphs: [
          'Snatcher does not download from YouTube, does not work with private posts, and does not keep your downloads. It is a downloader, not a host.',
        ],
      },
      {
        heading: 'Who makes it',
        paragraphs: [
          `Snatcher is built and run by Mobeen Nasir. Questions and error reports go to <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>.`,
        ],
      },
    ],
  },

  contact: {
    title: 'Contact',
    description:
      'How to reach Snatcher: email for questions and takedown notices, WhatsApp from the error page for failed downloads.',
    intro: 'The fastest way to reach Snatcher is by email. Error reports can also go through WhatsApp from the error page.',
    sections: [
      {
        heading: 'Email',
        paragraphs: [
          `Write to <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a> for questions, suggestions, and copyright takedown notices.`,
        ],
      },
      {
        heading: 'Error reports',
        paragraphs: [
          `If a download fails, use the \u201cReport on WhatsApp\u201d button on the error page. It prefills a message with the error and the link that failed. You can also write on WhatsApp directly at <a href="${CONTACT_WHATSAPP}" target="_blank" rel="noopener">wa.me/923136701631</a>.`,
        ],
      },
      {
        heading: 'Response time',
        paragraphs: [
          'Snatcher is a one-person project, so replies take a few days. Takedown notices are handled first.',
        ],
      },
    ],
  },
};

module.exports = { LEGAL_PAGES, CONTACT_EMAIL, CONTACT_WHATSAPP };
