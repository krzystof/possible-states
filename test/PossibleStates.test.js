/* eslint-env jest */

import PossibleStates from '../lib'

describe('PossibleStates() constructor', () => {
  test('first value is initial value', () => {
    const ui = PossibleStates('a', 'b', 'c')

    expect(ui.current()).toBe('a')
  })

  test('state<one, two> creates a state with 2 attributes', () => {
    const ui = PossibleStates('a', 'b<first, second>').toB('foo', 'bar')

    expect(ui.data()).toEqual({first: 'foo', second: 'bar'})
  })

  test('throws error when no arguments', () => {
    expect(() => PossibleStates()).toThrow(Error)
  })

  test('throws error if initial state defined needs data', () => {
    expect(() => PossibleStates('a<no>')).toThrow(Error)
  })

  test('throws error when invalid number of args when multiple needed', () => {
    expect(() => PossibleStates('a', 'b<first, second>').toB('foo')).toThrow(Error)
  })
})

describe('to___() dynamic transitions helpers', () => {
  let ui

  beforeEach(() => {
    ui = PossibleStates('a', 'b', 'c')
  })

  test('created for each possible states', () => {
    expect(ui.toA).toBeInstanceOf(Function)
    expect(ui.toB).toBeInstanceOf(Function)
    expect(ui.toC).toBeInstanceOf(Function)
  })

  test('created for container types', () => {
    ui = PossibleStates('a', 'b<example>', 'c')
    expect(ui.toB).toBeInstanceOf(Function)
  })

  test('changes the current state', () => {
    expect(ui.current()).toBe('a')

    ui = ui.toB()

    expect(ui.current()).toBe('b')
  })

  test('does not mutate the original object', () => {
    const transitioned = ui.toC().toA()

    expect(ui).not.toBe(transitioned)
  })

  test('transition to a state that holds data', () => {
    ui = PossibleStates('a', 'b<example>', 'c')

    ui = ui.toB('some piece of data')

    expect(ui.data()).toEqual({example: 'some piece of data'})
  })

  test('transition with wrong number of args throws an error', () => {
    ui = PossibleStates('a', 'b<required>')

    expect(() => ui.toB()).toThrow(Error)
  })
})

describe('when___() dynamic functions', () => {
  let ui

  beforeEach(() => {
    ui = PossibleStates('a', 'b', 'c')
  })

  test('are defined for each possible states', () => {
    expect(ui.whenA).toBeInstanceOf(Function)
    expect(ui.whenB).toBeInstanceOf(Function)
    expect(ui.whenC).toBeInstanceOf(Function)
  })

  test('runs the callback when it matches', () => {
    const mock = jest.fn()

    ui.whenA(() => mock('a'))
    ui.whenB(() => mock('b'))
    ui.whenC(() => mock('c'))

    expect(mock).toHaveBeenCalledTimes(1)
    expect(mock).toHaveBeenCalledWith('a')
  })

  test('returns the result of the callback', () => {
    expect(ui.whenA(() => 'return this')).toBe('return this')
    expect(ui.whenB(() => 'but not this')).toBeNull()
  })

  test('receives enclosed data has arguments in its callback', () => {
    ui = PossibleStates('a', 'b<example>', 'c')

    const result = ui.toB('so long!').whenB(args => args)

    expect(result).toEqual({example: 'so long!'})
  })
})

describe('caseOf()', () => {
  let ui

  beforeEach(() => {
    ui = PossibleStates('a', 'b', 'c')
  })

  test('executes a callback based on the currentState', () => {
    const mock = jest.fn()

    ui.caseOf({
      a: () => mock('a'),
      b: () => mock('b'),
      c: () => mock('c'),
    })

    expect(mock).toHaveBeenCalledTimes(1)
    expect(mock).toHaveBeenCalledWith('a')
  })

  test('returns the result of the callback', () => {
    ui = PossibleStates('a', 'b')

    const result = ui.caseOf({
      a: () => 'a',
      b: () => 'b',
    })

    expect(result).toBe('a')
  })

  test('has catch all clause', () => {
    const mock = jest.fn()

    ui.caseOf({
      c: () => mock('c'),
      _: () => mock('catch all'),
    })

    expect(mock).toHaveBeenCalledTimes(1)
    expect(mock).toHaveBeenCalledWith('catch all')
  })

  test('receives arguments in its callback', () => {
    ui = PossibleStates('a', 'b<example>')

    ui.toB('so long!').caseOf({
      b: args => expect(args).toEqual({example: 'so long!'}),
      _: () => {},
    })
  })

  test('throws error if not all cases are covered', () => {
    expect(() => ui.caseOf({a: () => {}})).toThrow(Error)
  })
})
