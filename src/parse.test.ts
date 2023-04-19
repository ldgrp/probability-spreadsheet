import { expect, it } from 'vitest'
import { evaluate } from './parse'

it('should evaluate simple expressions', () => {
    expect(evaluate('1')).toEqual([1])
    expect(evaluate('+1')).toEqual([1])
    expect(evaluate('-1')).toEqual([-1])

    expect(evaluate('1.5')).toEqual([1.5])
    expect(evaluate('+1.5')).toEqual([1.5])
    expect(evaluate('-1.5')).toEqual([-1.5])

    expect(evaluate('1 + 2')).toEqual([3])
    expect(evaluate('1 - 2')).toEqual([-1])
    expect(evaluate('-1 - 2')).toEqual([-3])
    expect(evaluate('1 + 2 + 3')).toEqual([6])
    expect(evaluate('1 + 2 + 3 + 4')).toEqual([10])

    expect(evaluate('(1 + 2) + 3 + 4 + 5')).toEqual([15])
    expect(evaluate('1 + (2 + 3) + 4 + 5')).toEqual([15])

    expect(evaluate('1 + 2 * 3')).toEqual([7])
    expect(evaluate('1 * 2 + 3')).toEqual([5])

    expect(evaluate('1 + 2 + 3 * 4')).toEqual([15])
    expect(evaluate('1 + 2 * 3 + 4')).toEqual([11])
    expect(evaluate('1 * 2 + 3 + 4')).toEqual([9])

    expect(evaluate('(1 + 2) * (3 + 4)')).toEqual([21])
})

it('should evaluate expressions with variables', () => {
    const variables = new Map<string, number[]>()
    const environment = variables.get
    variables.set('a', [1, 1])
    expect(evaluate('a + 2 + 3 * 4', environment)).toEqual([15, 15])
    expect(() => evaluate('a + 2 + 3 * 4')).toThrowError('No environment set')

    // Expect non existent variable to throw an error
    expect(() => evaluate('b + 2 + 3 * 4', environment)).toThrowError('Unknown variable: b')

    // Expect mismatched array lengths to throw an error
    variables.set('b', [1, 1, 1])
    expect(() => evaluate('a + b', environment)).toThrowError('Mismatched array lengths: 2 and 3')

    // Expect matching array lengths to work
    variables.set('c', [2, 2])
    expect(evaluate('a + c', environment)).toEqual([3, 3])
    expect(evaluate('a * c', environment)).toEqual([2, 2])
})