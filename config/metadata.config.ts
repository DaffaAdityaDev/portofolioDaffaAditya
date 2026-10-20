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
    },
    /** Same wording as the Contact section and the footer. Read by /llms.txt. */
    availability: 'Available for full-time software engineering roles and freelance projects.',
    /** As stated in the About section. Read by /llms.txt and the home page JSON-LD (alumniOf). */
    education: {
      school: 'Universitas Bina Sarana Informatika',
      degree: 'S.Kom, Software Engineering',
      year: '2024',
    },
};

/** Profile URLs for JSON-LD `sameAs`. */
export const SAME_AS = [siteConfig.links.github, siteConfig.links.linkedin];

/** Appended to page titles by <Seo> (unless `fullTitle`). */
export const TITLE_SUFFIX = ` | ${siteConfig.name}`;
