import { expect, test } from "@playwright/test"

function uniqueClientAddress() {
  const suffix = crypto.getRandomValues(new Uint8Array(2))
  return `198.51.${suffix[0]}.${suffix[1]}`
}

test("System follows the operating-system theme and invalid storage falls back safely", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("waxflow-theme", "invalid")
  })
  await page.emulateMedia({ colorScheme: "dark" })
  await page.goto("/")

  await expect(page.getByLabel("Theme")).toHaveCount(0)
  await expect(page.locator("html")).toHaveAttribute(
    "data-theme-preference",
    "system",
  )
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark")

  await page.emulateMedia({ colorScheme: "light" })
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light")
})

test("the Account headings stay within their columns", async ({ page }) => {
  await page.goto("/")

  const heroHeading = page.getByRole("heading", {
    name: "Remember the mixes that move you.",
  })
  const panelHeading = page.getByRole("heading", {
    name: "Sign in to Waxflow",
  })

  for (const width of [768, 900, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 800 })
    for (const heading of [heroHeading, panelHeading]) {
      await expect(heading).toBeVisible()
      expect(
        await heading.evaluate(
          (element) => element.scrollWidth <= element.clientWidth,
        ),
      ).toBe(true)
    }
  }
})

test("a DJ registers, verifies, signs in, opens Library Search, and signs out", async ({
  context,
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
  await context.setOffline(true)
  await page.getByLabel("Theme").selectOption("dark")
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark")
  expect(
    await page.evaluate(() => window.localStorage.getItem("waxflow-theme")),
  ).toBe("dark")
  await context.setOffline(false)
  await expect(
    page.getByRole("heading", { name: "Your Library is empty" }),
  ).toBeVisible()
  const librarySearch = page.getByRole("searchbox", {
    name: "Search your Library",
  })
  await librarySearch.fill("personally tested")
  await expect(librarySearch).toHaveValue("personally tested")
  await expect(page.getByRole("button", { name: "Sign out" })).toBeVisible()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true)

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
  await expect(page.getByLabel("Theme")).toHaveCount(0)
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark")

  const accountAfterSignOut = await page.evaluate(async () =>
    fetch("/api/account").then((response) => response.status),
  )
  expect(accountAfterSignOut).toBe(401)

  await page.reload()
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark")
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

test("an expired verification callback does not show a success notice", async ({
  page,
}) => {
  await page.goto("/?verified=true&error=TOKEN_EXPIRED")

  await expect(page.getByRole("alert")).toContainText(
    "This verification link is invalid or has expired",
  )
  await expect(page.getByRole("status")).toHaveCount(0)
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
