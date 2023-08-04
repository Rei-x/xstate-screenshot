import { test } from 'vitest'
import { anotherFunction } from '../xstate-screenshot/index.ts'

test('anotherFunction works as expected', () => {
  const result = anotherFunction(actualParam1, actualParam2)
  const expected = actualExpectedResult
  if (result !== expected) {
    throw new Error(`${result} !== ${expected}`)
  }
})