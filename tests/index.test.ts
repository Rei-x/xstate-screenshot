import { test } from 'vitest'
import { anotherFunction } from '../xstate-screenshot/index.ts'

test('anotherFunction works as expected', () => {
  const result = anotherFunction(param1, param2)
  // replace expected with the expected result
  const expected = 'expected result'
  if (result !== expected) {
    throw new Error(`${result} !== ${expected}`)
  }
})