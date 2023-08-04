import { test } from 'vitest'
import { someFunction } from '../xstate-screenshot/bin.ts'

test('someFunction works as expected', () => {
  const result = someFunction(param1, param2)
  // replace expected with the expected result
  const expected = 'expected result'
  if (result !== expected) {
    throw new Error(`${result} !== ${expected}`)
  }
})