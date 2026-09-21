import { env, exports } from "cloudflare:workers"
import { expect } from "vitest"

const origin = "https://waxflow.test"
let clientAddress = 1

type CapturedEmailKind = "verification" | "password-reset"

export function request(path: string, init?: RequestInit) {
  const headers = new Headers(init?.headers)
  if (!headers.has("cf-connecting-ip")) {
    headers.set("cf-connecting-ip", `192.0.2.${clientAddress++}`)
  }
  return exports.default.fetch(
    new Request(`${origin}${path}`, { ...init, headers }),
  )
}

export async function getCapturedEmailActionUrl(
  recipient: string,
  kind: CapturedEmailKind,
) {
  const captured = await env.DB.prepare(
    "SELECT actionUrl FROM test_email WHERE recipient = ? AND kind = ? ORDER BY createdAt DESC LIMIT 1",
  )
    .bind(recipient, kind)
    .first<{ actionUrl: string }>()

  expect(captured).not.toBeNull()
  return captured!.actionUrl
}

export async function createVerifiedAccount(email: string, password: string) {
  const registration = await request("/api/auth/sign-up/email", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: email, email, password, callbackURL: "/" }),
  })
  expect(registration.status).toBe(200)

  const actionUrl = await getCapturedEmailActionUrl(email, "verification")
  const verification = await exports.default.fetch(
    new Request(actionUrl, { redirect: "manual" }),
  )
  expect(verification.status).toBe(302)
}

export { env, exports, origin }
