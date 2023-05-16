import {
  Token,
  alt,
  alt_sc,
  apply,
  buildLexer,
  expectEOF,
  expectSingleResult,
  kmid,
  list,
  lrec_sc,
  opt,
  rule,
  seq,
  str,
  tok,
} from "typescript-parsec";

/*
  A parser for a simple calculator language
  All values are arrays of numbers
  Single numbers are represented as arrays of length 1
  Math operations are performed element-wise
 */

enum TokenKind {
  Number,
  Add,
  Sub,
  Mul,
  Div,
  LParen,
  RParen,
  LBracket,
  RBracket,
  Space,
  Identifier,
  Comma,
}

/**
 * A map of variable names to their values.
 * This is set before parsing and used by the parser
 * to replace variable tokens with their values
 *
 * TODO: This is a quick and dirty way to do this.
 */
let environment: ((identifier: string) => number[] | undefined) | undefined;
let functionEnvironment:
  | Map<string, (params: number[][]) => number[]>
  | undefined;

const lexer = buildLexer([
  [true, /^\d+(\.\d+)?/g, TokenKind.Number],
  [true, /^\+/g, TokenKind.Add],
  [true, /^\-/g, TokenKind.Sub],
  [true, /^\*/g, TokenKind.Mul],
  [true, /^\//g, TokenKind.Div],
  [true, /^\(/g, TokenKind.LParen],
  [true, /^\)/g, TokenKind.RParen],
  [true, /^\[/g, TokenKind.LBracket],
  [true, /^\]/g, TokenKind.RBracket],
  [true, /^[a-zA-Z_][a-zA-Z0-9_]*/g, TokenKind.Identifier],
  [true, /^\,/g, TokenKind.Comma],
  [false, /^\s+/g, TokenKind.Space],
]);

/**
 * Replace the variable token with its value from the environment
 */
function applyVariable(value: Token<TokenKind.Identifier>): number[] {
  if (environment === undefined) {
    throw new Error("No environment set");
  }
  const variable = environment(value.text);
  if (variable === undefined) {
    throw new Error(`Unknown variable: ${value.text}`);
  }
  return variable;
}

function applyFunction(
  value: [
    Token<TokenKind>,
    Token<TokenKind>,
    number[][] | undefined,
    Token<TokenKind>
  ]
): number[] {
  const functionName = value[0].text;
  const args = value[2];
  return applyFunction_(functionName, args);
}

function applyFunction_(name: string, args: number[][] | undefined): number[] {
  if (functionEnvironment === undefined) {
    throw new Error("No function environment set");
  }

  const fn = functionEnvironment.get(name);
  if (fn === undefined) {
    throw new Error(`Unknown function: ${name}`);
  }
  try {
    return fn(args ?? []);
  } catch (e) {
    throw new Error(`Error in function ${name}: ${e}`);
  }
}

function applyBracket(
  value: [
    Token<TokenKind>,
    number[],
    Token<TokenKind>,
    number[],
    Token<TokenKind>
  ]
): number[] {
  const a = value[1];
  const b = value[3];
  return applyFunction_("triangular", [a, b]);
}

function applyNumber(value: Token<TokenKind.Number>): number[] {
  return [+value.text];
}

function applyUnary(value: [Token<TokenKind>, number[]]): number[] {
  switch (value[0].kind) {
    case TokenKind.Add:
      return value[1].map((v) => +v);
    case TokenKind.Sub:
      return value[1].map((v) => -v);
    default:
      throw new Error(`Unknown unary operator: ${value[0].text}`);
  }
}

function applyBinary(
  first: number[],
  second: [Token<TokenKind>, number[]]
): number[] {
  if (first.length === 1) {
    return second[1].map((v) => applyBinarySingle(first[0], v, second[0]));
  } else if (second[1].length === 1) {
    return first.map((v) => applyBinarySingle(v, second[1][0], second[0]));
  } else if (first.length === second[1].length) {
    return first.map((firstValue, index) =>
      applyBinarySingle(firstValue, second[1][index], second[0])
    );
  }
  throw new Error(
    `Mismatched array lengths: ${first.length} and ${second[1].length}`
  );
}

function applyBinarySingle(
  first: number,
  second: number,
  operation: Token<TokenKind>
): number {
  switch (operation.kind) {
    case TokenKind.Add:
      return first + second;
    case TokenKind.Sub:
      return first - second;
    case TokenKind.Mul:
      return first * second;
    case TokenKind.Div:
      return first / second;
    default:
      throw new Error(`Unknown binary operator: ${operation.text}`);
  }
}

const TERM = rule<TokenKind, number[]>();
const FACTOR = rule<TokenKind, number[]>();
const EXP = rule<TokenKind, number[]>();

/*
TERM
  = NUMBER
  = '[' EXP ',' EXP ']'
  = IDENTIFIER '(' EXP (',' EXP)* ')' // Functions
  = VARIABLE
  = ('+' | '-') TERM
  = '(' EXP ')'
*/
TERM.setPattern(
  alt_sc(
    apply(tok(TokenKind.Number), applyNumber),
    apply(seq(str("["), EXP, str(","), EXP, str("]")), applyBracket),
    apply(
      seq(
        tok(TokenKind.Identifier),
        str("("),
        opt(list(EXP, str(","))),
        str(")")
      ),
      applyFunction
    ),
    apply(tok(TokenKind.Identifier), applyVariable),
    apply(seq(alt(tok(TokenKind.Add), tok(TokenKind.Sub)), TERM), applyUnary),
    kmid(str("("), EXP, str(")"))
  )
);

/*
FACTOR
  = TERM
  = FACTOR ('*' | '/') TERM
*/
FACTOR.setPattern(
  lrec_sc(
    TERM,
    seq(alt(tok(TokenKind.Mul), tok(TokenKind.Div)), TERM),
    applyBinary
  )
);

/*
EXP
  = FACTOR
  = EXP ('+' | '-') FACTOR
*/
EXP.setPattern(
  lrec_sc(
    FACTOR,
    seq(alt(tok(TokenKind.Add), tok(TokenKind.Sub)), FACTOR),
    applyBinary
  )
);

export function evaluate(
  expr: string,
  variables?: (identifier: string) => number[] | undefined,
  functions?: Map<string, (args: number[][]) => number[]>
): number[] {
  const tokens = lexer.parse(expr);
  if (variables) environment = variables;
  if (functions) functionEnvironment = functions;
  const result = expectSingleResult(expectEOF(EXP.parse(tokens)));
  environment = undefined;
  functionEnvironment = undefined;
  return result;
}
