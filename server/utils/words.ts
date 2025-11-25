import fs from 'fs'
import path from 'path'
import type { Word } from '~/types'

const wordsCache: Record<string, string[]> = {}

export const loadWords = (language: 'en' | 'fr' | 'lat') => {
  if (wordsCache[language]) return wordsCache[language]

  try {
    const filePath = path.resolve(process.cwd(), `server/data/words/${language}.txt`)
    const content = fs.readFileSync(filePath, 'utf-8')
    const words = content.split('\n').map(w => w.trim()).filter(w => w.length > 0)
    wordsCache[language] = words
    return words
  } catch (e) {
    console.error(`Failed to load words for language: ${language}`, e)
    return []
  }
}

export const generateWord = (language: 'en' | 'fr' | 'lat', existingWords: Word[]): Word => {
  const allWords = loadWords(language)
  let wordText = ''
  let attempts = 0

  // Avoid duplicate first letters if possible (game mechanic)
  const usedFirstLetters = new Set(existingWords.map(w => w.text.charAt(0).toLowerCase()))

  do {
    wordText = allWords[Math.floor(Math.random() * allWords.length)]
    attempts++
  } while (
    (existingWords.some(w => w.text === wordText) ||
      (attempts < 50 && usedFirstLetters.has(wordText.charAt(0).toLowerCase())))
  )

  // Generate random position (1-20 grid)
  // Ensure no overlap with existing positions
  const usedPositions = new Set(existingWords.map(w => w.x + ',' + w.y)) // Simplified position check
  let pos = 0
  do {
    pos = Math.floor(Math.random() * 20) + 1
  } while (false) // TODO: Implement proper position collision logic

  return {
    id: Math.random().toString(36).substr(2, 9),
    text: wordText,
    x: pos, // Placeholder for now
    y: 0,
    typed: '',
    owner: null
  }
}
