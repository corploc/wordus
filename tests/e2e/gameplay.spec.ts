import { test, expect } from '@playwright/test';

test('game flow', async ({ browser }) => {
  // Create two contexts for two players
  const context1 = await browser.newContext();
  const context2 = await browser.newContext();

  const page1 = await context1.newPage();
  const page2 = await context2.newPage();

  page1.on('console', msg => console.log('Page1 Console:', msg.text()));
  page2.on('console', msg => console.log('Page2 Console:', msg.text()));

  // Wait for socket connection
  await page1.waitForEvent('console', msg => msg.text().includes('Socket connected!'));

  // 1. Host creates room
  await page1.goto('/');
  await page1.fill('input[placeholder="Enter your name"]', 'HostUser');
  await page1.click('button:has-text("Create Room")');

  // Wait for room to be created and get code
  await page1.waitForURL(/\/game\/.+/);
  const roomCode = await page1.locator('.text-3xl').innerText();
  console.log('Room Code:', roomCode);

  // 2. Player joins room
  await page2.goto('/');
  await page2.fill('input[placeholder="Enter your name"]', 'JoinUser');
  await page2.locator('input[placeholder="ABCD"]').fill(roomCode);
  await page2.click('button:has-text("Join Room")');

  // Wait for join
  await page2.waitForURL(/\/game\/.+/);

  // Verify both players are visible
  await expect(page1.locator('text=JoinUser')).toBeVisible();
  await expect(page2.locator('text=HostUser')).toBeVisible();

  // 3. Start Game
  await page1.click('button:has-text("START GAME")');

  // Verify game started (words appear)
  await expect(page1.locator('.text-green-400')).toBeVisible({ timeout: 10000 });
  await expect(page2.locator('.text-green-400')).toBeVisible({ timeout: 10000 });

  // 4. Gameplay (Typing)
  // Get a word from page1
  const wordText = await page1.locator('.text-white').first().innerText();
  console.log('Target Word:', wordText);

  // Type the word on page1
  await page1.keyboard.type(wordText);

  // Verify score update
  await expect(page1.locator('.text-2xl.font-bold').first()).not.toHaveText('0');
});
