import { expect, test } from '@playwright/test'

test('a DJ registers, verifies, signs in, opens Library Search, and signs out', async ({
  page,
  request,
}) => {
  const email = `dj-${crypto.randomUUID()}@example.com`
  const password = 'correct horse battery staple'

  await page.goto('/')

  await page.getByLabel('Email address').fill(email)
  await page.getByLabel('Password').fill('wrong-password')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page.getByRole('alert')).toHaveText('Email or password is incorrect.')

  await page.getByRole('button', { name: 'Create an Account' }).click()
  await page.getByLabel('Email address').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Create Account' }).click()
  await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible()

  const captured = await request.get(
    `/api/test/emails/latest?recipient=${encodeURIComponent(email)}`,
  )
  expect(captured.ok()).toBe(true)
  const { verificationUrl } = (await captured.json()) as { verificationUrl: string }

  await page.goto(verificationUrl)
  await expect(page).toHaveURL(/verified=true/)
  await expect(page.getByRole('status')).toContainText('Email verified')

  await page.getByLabel('Email address').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Sign in' }).click()

  await expect(page.getByRole('heading', { name: 'Library Search' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Your Library is empty' })).toBeVisible()

  const accountBeforeSignOut = await page.evaluate(async () => {
    const response = await fetch('/api/account')
    return { status: response.status, body: await response.json() }
  })
  expect(accountBeforeSignOut.status).toBe(200)
  expect(accountBeforeSignOut.body.account.email).toBe(email)
  expect(accountBeforeSignOut.body.account.id).not.toBe(email)

  await page.getByRole('button', { name: 'Sign out' }).click()
  await expect(page.getByRole('heading', { name: 'Sign in to Waxflow' })).toBeVisible()

  const accountAfterSignOut = await page.evaluate(async () =>
    fetch('/api/account').then((response) => response.status),
  )
  expect(accountAfterSignOut).toBe(401)
})

test('an invalid verification attempt has a safe error', async ({ page }) => {
  await page.goto('/api/auth/verify-email?token=invalid&callbackURL=/')

  await expect(page.getByRole('alert')).toContainText(
    'This verification link is invalid or has expired',
  )
})
