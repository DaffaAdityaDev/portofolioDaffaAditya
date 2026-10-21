import fs from 'node:fs';

const CONSTANTS_FILE = 'features/Blog/constants.ts';
const POST_ROUTE_FILE = 'pages/blog/post/[id].tsx';

// Keep in sync with BLOG_CATEGORIES in features/Blog/constants.ts.
const CATEGORIES = [
  { name: 'System Design', value: 'system-design' },
  { name: 'Tech', value: 'tech' },
  { name: 'Blog', value: 'blog' },
];

const SITE_CONFIG_FILE = 'config/metadata.config.ts';

const KEBAB_CASE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_TITLE_LENGTH = 60;
const MAX_DESCRIPTION_LENGTH = 155;

const readRepoFile = (file) => fs.readFileSync(new URL(file, import.meta.url), 'utf8');

// Seo adds TITLE_SUFFIX (` | ${siteConfig.name}`, config/metadata.config.ts) to every <title>. This file is
// plain ESM and cannot import TS, so it reads siteConfig.name (the first `name:` there) from the source.
const siteName = readRepoFile(SITE_CONFIG_FILE).match(/\bname:\s*'([^']+)'/)?.[1];
if (!siteName) throw new Error(`plopfile: could not read siteConfig.name from ${SITE_CONFIG_FILE}.`);
const TITLE_SUFFIX_LENGTH = ` | ${siteName}`.length;

export default function plopfile(plop) {
  plop.setHelper('currentDate', () => new Date().toISOString().split('T')[0]);
  // A single-quoted TS string literal. Use it with {{{ }}} so Handlebars does not HTML-escape it.
  plop.setHelper('tsString', (value) => `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`);

  plop.setGenerator('blog-post', {
    description: 'Create a blog post: its component, a widgets folder, and its registry entries',
    prompts: [
      {
        type: 'input',
        name: 'title',
        message: 'Title (the page h1):',
        validate: (value) => value.trim().length > 0 || 'A title is required.',
      },
      {
        type: 'input',
        name: 'seoTitle',
        message: `Shorter <title> for search results (leave empty to use the title):`,
        when: (answers) => answers.title.length + TITLE_SUFFIX_LENGTH > MAX_TITLE_LENGTH,
        validate: (value) =>
          value.length === 0 ||
          value.length + TITLE_SUFFIX_LENGTH <= MAX_TITLE_LENGTH ||
          `Keep it at ${MAX_TITLE_LENGTH - TITLE_SUFFIX_LENGTH} characters or fewer.`,
      },
      {
        type: 'input',
        name: 'id',
        message: 'URL slug (kebab-case, becomes /blog/post/<slug>):',
        default: (answers) => plop.getHelper('kebabCase')(answers.title),
        validate: (value) => {
          if (!KEBAB_CASE.test(value)) return 'Use lowercase letters, digits and single dashes.';
          // The component folder and name are the PascalCase slug, which cannot start with a digit.
          if (/^\d/.test(value)) return 'Start the slug with a letter.';
          if (readRepoFile(CONSTANTS_FILE).includes(`id: '${value}'`)) return `A post with id "${value}" already exists.`;
          return true;
        },
      },
      {
        type: 'list',
        name: 'category',
        message: 'Category:',
        choices: CATEGORIES,
      },
      {
        type: 'input',
        name: 'description',
        message: `Description (imperative, at most ${MAX_DESCRIPTION_LENGTH} characters):`,
        validate: (value) =>
          (value.trim().length > 0 && value.length <= MAX_DESCRIPTION_LENGTH) ||
          `Write 1 to ${MAX_DESCRIPTION_LENGTH} characters (now ${value.length}).`,
      },
      {
        type: 'input',
        name: 'timeToRead',
        message: 'Minutes to read:',
        default: '5',
        validate: (value) => /^[1-9]\d*$/.test(value) || 'Enter a whole number of minutes.',
      },
      {
        type: 'confirm',
        name: 'production',
        message: 'Publish it now? (No keeps it out of the list, the sitemap and the build)',
        default: false,
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'features/Blog/posts/{{pascalCase id}}/index.tsx',
        templateFile: 'templates/blog-post.tsx.hbs',
      },
      {
        type: 'add',
        path: 'features/Blog/posts/{{pascalCase id}}/widgets/.gitkeep',
        template: '',
      },
      // POSTS_DATA is newest first, so the new post goes on top.
      {
        type: 'modify',
        path: CONSTANTS_FILE,
        // $2 is the file's own line ending, so a CRLF checkout stays CRLF.
        pattern: /(export const POSTS_DATA = \[)(\r?\n)/,
        template: [
          '$1$2  {',
          "    id: '{{id}}',",
          "    category: '{{category}}',",
          '    title: {{{tsString title}}},',
          '{{#if seoTitle}}    seoTitle: {{{tsString seoTitle}}},$2{{/if}}' + "    date: '{{currentDate}}',",
          '    timeToRead: {{timeToRead}},',
          '    description: {{{tsString description}}},',
          "    image: '/image/blogs/{{id}}/banner.webp',",
          "    heroImage: '/image/blogs/{{id}}/hero.webp',",
          "    ogImage: '/image/blogs/{{id}}/og.jpg',",
          '    production: {{production}},',
          '  },',
          '',
        ].join('$2'),
      },
      {
        type: 'modify',
        path: POST_ROUTE_FILE,
        pattern: /(const POSTS = \{)(\r?\n)/,
        template: [
          "$1$2  '{{id}}': {",
          "    Content: dynamic(() => import('@/features/Blog/posts/{{pascalCase id}}')),",
          "    load: () => import('@/features/Blog/posts/{{pascalCase id}}'),",
          '  },',
          '',
        ].join('$2'),
      },
      () =>
        'Next: add banner.webp + hero.webp (1280x720) and og.jpg (1200x630) to public/image/blogs/<slug>/, then run `bun run blog:avif` for the AVIF copies.',
    ],
  });
}
