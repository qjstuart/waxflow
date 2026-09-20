import { betterAuth } from 'better-auth'
import { deliverVerificationEmail } from './email.js'

export function createAuth(request: Request, env: Env, ctx: ExecutionContext) {
  const origin = new URL(request.url).origin

  return betterAuth({
    appName: 'Waxflow',
    baseURL: origin,
    database: env.DB,
    secret: env.BETTER_AUTH_SECRET,
    trustedOrigins: [origin],
    emailAndPassword: {
      enabled: true,
      autoSignIn: false,
      requireEmailVerification: true,
    },
    emailVerification: {
      autoSignInAfterVerification: false,
      expiresIn: 60 * 60,
      sendOnSignIn: true,
      sendOnSignUp: true,
      sendVerificationEmail: ({ user, url }) => {
        const delivery = deliverVerificationEmail(env, {
          recipient: user.email,
          url,
        })

        if (env.EMAIL_DELIVERY_MODE === 'capture') {
          return delivery
        }

        ctx.waitUntil(
          delivery.catch((error: unknown) => {
            console.error(
              JSON.stringify({
                message: 'verification email delivery failed',
                error: error instanceof Error ? error.message : String(error),
              }),
            )
          }),
        )
        return Promise.resolve()
      },
    },
    advanced: {
      database: {
        generateId: 'uuid',
      },
    },
  })
}
