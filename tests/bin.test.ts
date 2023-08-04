import { test } from 'vitest'
import { someFunction } from '../xstate-screenshot/bin.ts'

test('someFunction works as expected', () => {
  const result = someFunction(actualParam1, actualParam2)
  const expected = actualExpectedResult
  if (result !== expected) {
    throw new Error(`${result} !== ${expected}`)
  }
})