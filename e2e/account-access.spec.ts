import { expect, test } from "@playwright/test"

function uniqueClientAddress() {
  const suffix = crypto.getRandomValues(new Uint8Array(2))
  return `198.51.${suffix[0]}.${suffix[1]}`
}

test("a DJ registers, verifies, signs in, opens Library Search, and signs out", async ({
  page,
  request,
}) => {
  await page.setExtraHTTPHeaders({
    "cf-connecting-ip": uniqueClientAddress(),
  })
  const email = `dj-${crypto.randomUUID()}@example.com`
  const password = "correct horse battery staple"

  await page.goto("/")

  await page.getByLabel("Email address").fill(email)
  await page.getByLabel("Password").fill("wrong-password")
  await page.getByRole("button", { name: "Sign in" }).click()
  await expect(page.getByRole("alert")).toHaveText(
    "Email or password is incorrect.",
  )

  await page.getByRole("button", { name: "Create an Account" }).click()
  await page.getByLabel("Email address").fill(email)
  await page.getByLabel("Password").fill(password)
  await page.getByRole("button", { name: "Create Account" }).click()
  await expect(
    page.getByRole("heading", { name: "Check your email" }),
  ).toBeVisible()
  await expect(page.getByRole("status")).toHaveText(
    "If an Account can be created with that email address, we’ll send you a verification message.",
  )

  await page.getByRole("button", { name: "Back to sign in" }).click()
  await page.getByLabel("Email address").fill(email)
  await page.getByLabel("Password").fill(password)
  await page.getByRole("button", { name: "Sign in" }).click()
  await expect(page.getByRole("alert")).toHaveText(
    "Check your email to verify your account.",
  )

  const captured = await request.get(
    `/api/test/emails/latest?recipient=${encodeURIComponent(email)}`,
  )
  expect(captured.ok()).toBe(true)
  const { actionUrl: verificationUrl } = (await captured.json()) as {
    actionUrl: string
  }

  await page.goto(verificationUrl)
  await expect(page).toHaveURL(/verified=true/)
  await expect(page.getByRole("status")).toContainText("Email verified")

  await page.getByLabel("Email address").fill(email)
  await page.getByLabel("Password").fill(password)
  await page.getByRole("button", { name: "Sign in" }).click()

  await expect(
    page.getByRole("heading", { name: "Library Search" }),
  ).toBeVisible()
  await expect(
    page.getByRole("heading", { name: "Your Library is empty" }),
  ).toBeVisible()

  const accountBeforeSignOut = await page.evaluate(async () => {
    const response = await fetch("/api/account")
    return { status: response.status, body: await response.json() }
  })
  expect(accountBeforeSignOut.status).toBe(200)
  expect(accountBeforeSignOut.body.account.email).toBe(email)
  expect(accountBeforeSignOut.body.account.id).not.toBe(email)

  await page.getByRole("button", { name: "Sign out" }).click()
  await expect(
    page.getByRole("heading", { name: "Sign in to Waxflow" }),
  ).toBeVisible()

  const accountAfterSignOut = await page.evaluate(async () =>
    fetch("/api/account").then((response) => response.status),
  )
  expect(accountAfterSignOut).toBe(401)
})

test("an invalid verification attempt has a safe error", async ({ page }) => {
  await page.setExtraHTTPHeaders({
    "cf-connecting-ip": uniqueClientAddress(),
  })
  await page.goto("/api/auth/verify-email?token=invalid&callbackURL=/")

  await expect(page.getByRole("alert")).toContainText(
    "This verification link is invalid or has expired",
  )
})

test("a DJ recovers Account access with a one-time reset message", async ({
  page,
  request,
}) => {
  await page.setExtraHTTPHeaders({
    "cf-connecting-ip": uniqueClientAddress(),
  })
  const email = `dj-${crypto.randomUUID()}@example.com`
  const formerPassword = "correct horse battery staple"
  const newPassword = "a newly remembered password"

  await page.goto("/")
  await page.getByRole("button", { name: "Create an Account" }).click()
  await page.getByLabel("Email address").fill(email)
  await page.getByLabel("Password").fill(formerPassword)
  await page.getByRole("button", { name: "Create Account" }).click()
  await expect(
    page.getByRole("heading", { name: "Check your email" }),
  ).toBeVisible()

  const verificationMessage = await request.get(
    `/api/test/emails/latest?recipient=${encodeURIComponent(email)}&kind=verification`,
  )
  const { actionUrl: verificationUrl } = (await verificationMessage.json()) as {
    actionUrl: string
  }
  await page.goto(verificationUrl)

  await page.getByRole("button", { name: "Forgot your password?" }).click()
  await page.getByLabel("Email address").fill(email)
  await page.getByRole("button", { name: "Send reset link" }).click()
  await expect(page.getByRole("status")).toHaveText(
    "If an Account uses that email address, we’ll send a password reset message.",
  )

  const resetMessage = await request.get(
    `/api/test/emails/latest?recipient=${encodeURIComponent(email)}&kind=password-reset`,
  )
  expect(resetMessage.ok()).toBe(true)
  const { actionUrl: resetUrl } = (await resetMessage.json()) as {
    actionUrl: string
  }
  await page.goto(resetUrl)

  await expect(
    page.getByRole("heading", { name: "Choose a new password" }),
  ).toBeVisible()
  await page.getByLabel("New password").fill(newPassword)
  await page.getByRole("button", { name: "Save new password" }).click()
  await expect(page.getByRole("status")).toHaveText(
    "Password updated. Sign in with your new password.",
  )

  await page.goto(resetUrl)
  await expect(page.getByRole("alert")).toHaveText(
    "This password reset link is invalid, expired, or has already been used.",
  )

  await page.getByLabel("Email address").fill(email)
  await page.getByLabel("Password").fill(formerPassword)
  await page.getByRole("button", { name: "Sign in" }).click()
  await expect(page.getByRole("alert")).toHaveText(
    "Email or password is incorrect.",
  )

  await page.getByLabel("Password").fill(newPassword)
  await page.getByRole("button", { name: "Sign in" }).click()
  await expect(
    page.getByRole("heading", { name: "Library Search" }),
  ).toBeVisible()
})
