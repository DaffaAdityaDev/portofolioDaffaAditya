export const siteConfig = {
    name: 'Daffa Aditya',
    title: 'Daffa Aditya',
    description:
      'Software engineer in Jakarta building Accounting+ and an enterprise low-code platform. Case studies and writing.',
    url: 'https://daffaaditya.id',
    ogImage: '/image/og-default.jpg',
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt: 'Daffa Aditya, Software Engineer',
    /** Portrait used in JSON-LD. */
    profileImage: '/image/profile-768.webp',
    /** X/Twitter handle with '@', for twitter:site/creator. Empty: no account, tags are skipped. */
    twitterHandle: '' as string,
    links: {
      github: 'https://github.com/DaffaAdityaDev',
      linkedin: 'https://www.linkedin.com/in/daffaadityarahman-14b588192/',
      email: 'daffaaditya.me@gmail.com'
    }
};

/** Profile URLs for JSON-LD `sameAs`. */
export const SAME_AS = [siteConfig.links.github, siteConfig.links.linkedin];

/** Appended to page titles by <Seo> (unless `fullTitle`). */
export const TITLE_SUFFIX = ` | ${siteConfig.name}`;
