import type { Room, User, Word } from '~/types'
import { generateWord } from './words'

export const startGame = (room: Room) => {
  room.state = 'PLAYING'
  room.timer = room.settings.duration
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
  // Find word that matches user's input
  const targetWord = room.words.find(w => w.text.startsWith(input))

  if (!targetWord) {
    // User typed something that doesn't match any word
    // Reset user's combo
    user.combo = 0

    // Remove user from all words they were typing
    room.words.forEach(w => {
      if (w.typingUsers) {
        w.typingUsers = w.typingUsers.filter(tu => tu.userId !== user.id)
      }
    })

    return { type: 'error' }
  }

  // Initialize typingUsers if not exists
  if (!targetWord.typingUsers) {
    targetWord.typingUsers = []
  }

  // Remove user from all OTHER words they were typing
  room.words.forEach(w => {
    if (w.id !== targetWord.id && w.typingUsers) {
      w.typingUsers = w.typingUsers.filter(tu => tu.userId !== user.id)

      // Recalculate owner for that word if needed
      if (w.typingUsers.length === 0) {
        w.owner = null
        w.typed = ''
      } else {
        const maxUser = w.typingUsers.reduce((max, tu) =>
          tu.typed.length > max.typed.length ? tu : max
        )
        w.owner = maxUser.userId
        w.typed = maxUser.typed
      }
    }
  })

  // Find or create entry for this user in target word
  let userEntry = targetWord.typingUsers.find(tu => tu.userId === user.id)
  if (!userEntry) {
    userEntry = { userId: user.id, typed: '' }
    targetWord.typingUsers.push(userEntry)
  }

  // Update user's progress
  userEntry.typed = input

  // Determine primary owner (user with most progress)
  let maxProgress = 0
  let primaryOwner = null
  let longestTyped = ''

  for (const tu of targetWord.typingUsers) {
    if (tu.typed.length > maxProgress) {
      maxProgress = tu.typed.length
      primaryOwner = tu.userId
      longestTyped = tu.typed
    }
  }

  targetWord.owner = primaryOwner
  targetWord.typed = longestTyped

  // No auto-completion - just return update for tracking
  return { type: 'update_letter', word: targetWord }
}

export const validateWord = (room: Room, user: User, submittedWord: string) => {
  const matchingWord = room.words.find(w => w.text === submittedWord)

  if (matchingWord) {
    // CORRECT - Award points
    const points = matchingWord.text.length
    let multiplier = 1
    if (user.combo >= 1) multiplier = 1.5
    if (user.combo >= 2) multiplier = 2
    if (user.combo >= 3) multiplier = 2.5
    if (user.combo >= 4) multiplier = 3

    const earnedPoints = Math.floor(points * multiplier)
    user.score += earnedPoints
    user.combo++

    // Reset combo for other users who were typing this word (they lost the race)
    matchingWord.typingUsers?.forEach(tu => {
      if (tu.userId !== user.id) {
        const otherUser = room.users.find(u => u.id === tu.userId)
        if (otherUser) {
          otherUser.combo = 0
        }
      }
    })

    // Remove word and generate new one
    room.words = room.words.filter(w => w.id !== matchingWord.id)
    room.words.push(generateWord(room.settings.language, room.words))

    return {
      correct: true,
      points: earnedPoints,
      completedWord: matchingWord
    }
  } else {
    // WRONG - Apply penalty
    const penalty = submittedWord.length
    user.score = Math.max(0, user.score - penalty)
    user.combo = 0

    return {
      correct: false,
      points: -penalty
    }
  }
}
