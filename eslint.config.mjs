import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';

// ESLint 9 flat config. Formatting is checked by `format:check` (Prettier), so here
// eslint-config-prettier only turns off the rules that would fight it.
const config = [
  {
    ignores: ['.next/**', '.next-verify/**', 'out/**', 'build/**', 'node_modules/**', 'next-env.d.ts', 'docs/**'],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  prettier,
  {
    rules: {
      '@next/next/no-title-in-document-head': 'off',
      '@next/next/no-img-element': 'off',
      'react/no-unescaped-entities': 'off',
    },
  },
];

export default config;
