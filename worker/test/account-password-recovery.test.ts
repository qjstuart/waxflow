import { describe, expect, it } from "vitest"

import {
  getCapturedEmailActionUrl,
  createVerifiedAccount,
  env,
  exports,
  request,
} from "./helpers/account-access"

describe("Account password recovery", () => {
  it("gives the same neutral response whether or not a recovery email identifies an Account", async () => {
    const email = `dj-${crypto.randomUUID()}@example.com`
    await createVerifiedAccount(email, "correct horse battery staple")

    const existing = await request("/api/auth/request-password-reset", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, redirectTo: "/?reset=true" }),
    })
    const missing = await request("/api/auth/request-password-reset", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: `missing-${crypto.randomUUID()}@example.com`,
        redirectTo: "/?reset=true",
      }),
    })

    expect(existing.status).toBe(200)
    expect(missing.status).toBe(200)
    await expect(existing.json()).resolves.toEqual(await missing.json())

    const actionUrl = await getCapturedEmailActionUrl(email, "password-reset")
    expect(actionUrl).toContain("/api/auth/reset-password/")
  })

  it("resets a password once and rejects the former password", async () => {
    const email = `dj-${crypto.randomUUID()}@example.com`
    const formerPassword = "correct horse battery staple"
    const newPassword = "a newly remembered password"
    await createVerifiedAccount(email, formerPassword)

    const recovery = await request("/api/auth/request-password-reset", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, redirectTo: "/?reset=true" }),
    })
    expect(recovery.status).toBe(200)

    const actionUrl = await getCapturedEmailActionUrl(email, "password-reset")
    const token = new URL(actionUrl).pathname.split("/").at(-1)

    const reset = await request("/api/auth/reset-password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ newPassword, token }),
    })
    expect(reset.status).toBe(200)

    const reused = await request("/api/auth/reset-password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ newPassword: "another new password", token }),
    })
    expect(reused.status).toBe(400)

    const formerSignIn = await request("/api/auth/sign-in/email", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password: formerPassword }),
    })
    expect(formerSignIn.status).toBe(401)

    const newSignIn = await request("/api/auth/sign-in/email", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password: newPassword }),
    })
    expect(newSignIn.status).toBe(200)
  })

  it("rejects an expired recovery link without changing credentials", async () => {
    const email = `dj-${crypto.randomUUID()}@example.com`
    const password = "correct horse battery staple"
    await createVerifiedAccount(email, password)

    await request("/api/auth/request-password-reset", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, redirectTo: "/?reset=true" }),
    })

    const actionUrl = await getCapturedEmailActionUrl(email, "password-reset")
    const token = new URL(actionUrl).pathname.split("/").at(-1)

    await env.DB.prepare(
      "UPDATE verification SET expiresAt = 0 WHERE identifier = ?",
    )
      .bind(`reset-password:${token}`)
      .run()

    const expiredLink = await exports.default.fetch(
      new Request(actionUrl, { redirect: "manual" }),
    )
    expect(expiredLink.status).toBe(302)
    expect(expiredLink.headers.get("location")).toContain("error=INVALID_TOKEN")

    const expiredReset = await request("/api/auth/reset-password", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ newPassword: "a newly remembered password", token }),
    })
    expect(expiredReset.status).toBe(400)

    const signIn = await request("/api/auth/sign-in/email", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    expect(signIn.status).toBe(200)
  })
})
