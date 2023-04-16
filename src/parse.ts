import { Token, alt, apply, buildLexer, expectEOF, expectSingleResult, kmid, lrec_sc, rule, seq, str, tok } from "typescript-parsec";

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
    Space,
    Variable,
}

/**
 * A map of variable names to their values.
 * This is set before parsing and used by the parser
 * to replace variable tokens with their values
 * 
 * TODO: This is a quick and dirty way to do this.
 */
let environment: Map<string, number[]> | null;

const lexer = buildLexer([
    [true, /^\d+(\.\d+)?/g, TokenKind.Number],
    [true, /^\+/g, TokenKind.Add],
    [true, /^\-/g, TokenKind.Sub],
    [true, /^\*/g, TokenKind.Mul],
    [true, /^\//g, TokenKind.Div],
    [true, /^\(/g, TokenKind.LParen],
    [true, /^\)/g, TokenKind.RParen],
    [true, /^[a-zA-Z_][a-zA-Z0-9_]*/g, TokenKind.Variable],
    [false, /^\s+/g, TokenKind.Space],
])

/**
 * Replace the variable token with its value from the environment
 */
function applyVariable(value: Token<TokenKind.Variable>): number[] {
    if (environment === null) {
        throw new Error("No environment set");
    }
    const variable = environment.get(value.text);
    if (variable === undefined) {
        throw new Error(`Unknown variable: ${value.text}`);
    }
    return variable;
}

function applyNumber(value: Token<TokenKind.Number>): number[] {
    return [+value.text];
}

function applyUnary(value: [Token<TokenKind>, number[]]): number[] {
    switch (value[0].kind) {
        case TokenKind.Add: return value[1].map(v => +v);
        case TokenKind.Sub: return value[1].map(v => -v);
        default: throw new Error(`Unknown unary operator: ${value[0].text}`);
    }
}

function applyBinary(first: number[], second: [Token<TokenKind>, number[]]): number[] {
    if (first.length === 1) {
        return second[1].map(v => applyBinarySingle(first[0], v, second[0]));
    } else if (second[1].length === 1) {
        return first.map(v => applyBinarySingle(v, second[1][0], second[0]));
    } else if (first.length === second[1].length) {
        return first.map((firstValue, index) => applyBinarySingle(firstValue, second[1][index], second[0]));
    }
    throw new Error(`Mismatched array lengths: ${first.length} and ${second[1].length}`)
}

function applyBinarySingle(first: number, second: number, operation: Token<TokenKind>): number {
    switch (operation.kind) {
        case TokenKind.Add: return first + second;
        case TokenKind.Sub: return first - second;
        case TokenKind.Mul: return first * second;
        case TokenKind.Div: return first / second;
        default: throw new Error(`Unknown binary operator: ${operation.text}`);
    }
}

const TERM = rule<TokenKind, number[]>();
const FACTOR = rule<TokenKind, number[]>();
const EXP = rule<TokenKind, number[]>();

/*
TERM
  = NUMBER
  = VARIABLE
  = ('+' | '-') TERM
  = '(' EXP ')'
*/
TERM.setPattern(
    alt(
        apply(tok(TokenKind.Number), applyNumber),
        apply(tok(TokenKind.Variable), applyVariable),
        apply(seq(alt(tok(TokenKind.Add), tok(TokenKind.Sub)), TERM), applyUnary),
        kmid(str('('), EXP, str(')'))
    )
);

/*
FACTOR
  = TERM
  = FACTOR ('*' | '/') TERM
*/
FACTOR.setPattern(
    lrec_sc(TERM, seq(alt(tok(TokenKind.Mul), tok(TokenKind.Div)), TERM), applyBinary)
);

/*
EXP
  = FACTOR
  = EXP ('+' | '-') FACTOR
*/
EXP.setPattern(
    lrec_sc(FACTOR, seq(alt(tok(TokenKind.Add), tok(TokenKind.Sub)), FACTOR), applyBinary)
);

export function evaluate(expr: string, variables?: Map<string, number[]>): number[] {
    const tokens = lexer.parse(expr);
    if (variables)
        environment = variables;
    const result = expectSingleResult(expectEOF(EXP.parse(tokens)));
    environment = null;
    return result;
}