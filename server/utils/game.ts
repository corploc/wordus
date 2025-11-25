import type { Room, User, Word } from '~/types'
import { generateWord } from './words'

export const startGame = (room: Room) => {
  room.state = 'PLAYING'
  room.words = []

  // Generate initial words
  for (let i = 0; i < room.settings.wordCount; i++) {
    room.words.push(generateWord(room.settings.language, room.words))
  }

  // Reset scores
  room.users.forEach(u => {
    u.score = 0
    u.combo = 0
  })
}

export const handleInput = (room: Room, user: User, input: string) => {
  // Find word user is typing
  // Logic: User types letters, we match against words
  // If user was already typing a word, continue
  // If not, check if input matches start of any word

  // Simplified logic for now:
  // We need to know which word the user is targeting.
  // The client sends the full input or just keypress?
  // Old app sent 'input' event with current text.

  // We need to find a word that matches the input
  const targetWord = room.words.find(w => w.text.startsWith(input))

  if (targetWord) {
    targetWord.typed = input
    targetWord.owner = user.id

    if (input === targetWord.text) {
      // Word completed
      completeWord(room, user, targetWord)
      return { type: 'word_finish', word: targetWord }
    }
    return { type: 'update_letter', word: targetWord }
  }

  return { type: 'error' }
}

const completeWord = (room: Room, user: User, word: Word) => {
  // Calculate score
  const points = word.text.length
  let multiplier = 1
  if (user.combo >= 1) multiplier = 1.5
  if (user.combo >= 2) multiplier = 2
  if (user.combo >= 3) multiplier = 2.5
  if (user.combo >= 4) multiplier = 3

  user.score += Math.floor(points * multiplier)
  user.combo++

  // Remove word and generate new one
  room.words = room.words.filter(w => w.id !== word.id)
  room.words.push(generateWord(room.settings.language, room.words))
}
