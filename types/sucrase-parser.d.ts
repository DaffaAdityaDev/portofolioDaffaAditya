// Sucrase ships typings for its tokenizer under dist/types, which deep imports do not
// pick up. Only the parts the playground engine reads are declared here. The ESM
// paths match what the bundler picks for the main `sucrase` import, so the parser is
// bundled once.
declare module 'sucrase/dist/esm/parser' {
  export interface SucraseToken {
    type: number;
    start: number;
    end: number;
    /** Part of TypeScript-only syntax that Sucrase removes. */
    isType: boolean;
  }

  export function parse(
    input: string,
    isJSXEnabled: boolean,
    isTypeScriptEnabled: boolean,
    isFlowEnabled: boolean,
  ): { tokens: SucraseToken[] };
}

declare module 'sucrase/dist/esm/parser/tokenizer/types' {
  export const TokenType: Readonly<
    Record<
      | '_for'
      | '_while'
      | '_const'
      | '_let'
      | '_var'
      | '_function'
      | '_class'
      | '_enum'
      | 'name'
      | 'dot'
      | 'parenL'
      | 'parenR'
      | 'braceL'
      | 'braceR'
      | 'bracketL'
      | 'bracketR'
      | 'dollarBraceL'
      | 'semi',
      number
    >
  >;
}
