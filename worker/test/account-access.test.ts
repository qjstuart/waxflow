import { env, exports } from 'cloudflare:workers'
import { describe, expect, it } from 'vitest'

const origin = 'https://waxflow.test'

function request(path: string, init?: RequestInit) {
  return exports.default.fetch(new Request(`${origin}${path}`, init))
}

describe('Account access', () => {
  it('registers, verifies, signs in, protects Account data, and invalidates sign-out', async () => {
    const email = `dj-${crypto.randomUUID()}@example.com`
    const password = 'correct horse battery staple'

    const registration = await request('/api/auth/sign-up/email', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: email, email, password, callbackURL: '/' }),
    })

    expect(registration.status).toBe(200)

    const captured = await env.DB.prepare(
      'SELECT verificationUrl FROM test_email WHERE recipient = ? ORDER BY createdAt DESC LIMIT 1',
    )
      .bind(email)
      .first<{ verificationUrl: string }>()

    expect(captured?.verificationUrl).toContain('/api/auth/verify-email')

    const verification = await exports.default.fetch(
      new Request(captured!.verificationUrl, { redirect: 'manual' }),
    )
    expect(verification.status).toBe(302)

    const signIn = await request('/api/auth/sign-in/email', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    expect(signIn.status).toBe(200)

    const cookie = signIn.headers.get('set-cookie')
    expect(cookie).toContain('better-auth.session_token=')

    const account = await request('/api/account', {
      headers: { cookie: cookie! },
    })
    expect(account.status).toBe(200)
    await expect(account.json()).resolves.toMatchObject({
      account: {
        id: expect.stringMatching(/^[0-9a-f-]{36}$/),
        email,
      },
    })

    const signOut = await request('/api/auth/sign-out', {
      method: 'POST',
      headers: { cookie: cookie!, origin },
    })
    expect(signOut.status).toBe(200)

    const afterSignOut = await request('/api/account', {
      headers: { cookie: cookie! },
    })
    expect(afterSignOut.status).toBe(401)
  })

  it('does not reveal whether invalid credentials belong to an Account', async () => {
    const response = await request('/api/auth/sign-in/email', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: `missing-${crypto.randomUUID()}@example.com`,
        password: 'not-the-password',
      }),
    })

    expect(response.status).toBe(401)
    await expect(response.json()).resolves.toMatchObject({
      message: 'Invalid email or password',
    })
  })
})
