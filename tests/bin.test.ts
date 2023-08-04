import { test } from 'vitest'
import { download } from '../xstate-screenshot/bin.ts'

test('download works as expected', () => {
  const url = 'https://example.com'
  const path = './example.txt'
  await download(url, path)
  // Check if the file was downloaded correctly
})