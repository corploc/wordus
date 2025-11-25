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

  // Pick an available position on the 4x5 grid (1..20) without overlap
  const maxCells = 20
  const usedPositions = new Set(existingWords.map(w => w.x))
  const availablePositions: number[] = []
  for (let i = 1; i <= maxCells; i++) {
    if (!usedPositions.has(i)) availablePositions.push(i)
  }

  // Fallback: if grid is somehow full, reuse a random cell
  const pos = availablePositions.length > 0
    ? availablePositions[Math.floor(Math.random() * availablePositions.length)]
    : Math.floor(Math.random() * maxCells) + 1

  return {
    id: Math.random().toString(36).substr(2, 9),
    text: wordText,
    x: pos,
    y: Math.ceil(pos / 4),
    typed: '',
    owner: null,
    typingUsers: []
  }
}
