import { test } from 'vitest'
import { getScreenshotUrl, readFileAndGetScreenshotUrl, generateScreenshots } from '../xstate-screenshot/index.ts'

test('getScreenshotUrl works as expected', () => {
  const fileContent = '...'
  const result = getScreenshotUrl(fileContent)
  // Check if the result is as expected
})

test('readFileAndGetScreenshotUrl works as expected', async () => {
  const filePath = './example.ts'
  const result = await readFileAndGetScreenshotUrl(filePath)
  // Check if the result is as expected
})

test('generateScreenshots works as expected', async () => {
  const filesPattern = '*.ts'
  const result = await generateScreenshots(filesPattern)
  // Check if the result is as expected
})