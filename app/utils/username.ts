const adjectives = [
  'Blue', 'Red', 'Green', 'Yellow', 'Purple', 'Pink',
  'White', 'Black', 'Gray', 'Silver', 'Gold',
  'Swift', 'Brave', 'Wild', 'Calm', 'Fierce',
  'Smoky', 'Misty', 'Sunny', 'Stormy', 'Frosty',
  'Happy', 'Lucky', 'Magic', 'Noble', 'Silent',
  'Bright', 'Dark', 'Shiny', 'Rusty', 'Crystal'
]

const nouns = [
  'Fox', 'Wolf', 'Bear', 'Lion', 'Tiger', 'Eagle',
  'Hawk', 'Raven', 'Dragon', 'Phoenix', 'Unicorn',
  'Shark', 'Whale', 'Dolphin', 'Octopus', 'Turtle',
  'Panther', 'Leopard', 'Cheetah', 'Jaguar', 'Lynx',
  'Owl', 'Falcon', 'Sparrow', 'Robin', 'Swan',
  'Panda', 'Koala', 'Rabbit', 'Deer', 'Moose'
]

export function generateRandomUsername(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  return `${adjective}${noun}`
}
