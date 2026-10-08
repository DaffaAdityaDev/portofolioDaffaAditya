import Prism, { type TokenStream } from 'prismjs';

// Order matters: tsx extends jsx and typescript, jsx extends markup and javascript (both in Prism core).
// Only the grammars the posts use are bundled; other languages render as plain text.
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';

// Highlighting happens during render, never through Prism's DOM auto-highlighter.
Prism.manual = true;

/**
 * Tokenizes code with Prism. Unknown languages come back as a single plain string,
 * so callers never have to special-case them.
 */
export function tokenizeCode(code: string, language: string): TokenStream {
  const grammar = Prism.languages[language];
  return grammar ? Prism.tokenize(code, grammar) : code;
}
