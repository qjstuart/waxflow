import { betterAuth } from "better-auth"
import { sendAccountEmail } from "./email.js"

export function createAuth(request: Request, env: Env, ctx: ExecutionContext) {
  const origin = new URL(request.url).origin

  return betterAuth({
    appName: "Waxflow",
    baseURL: origin,
    database: env.DB,
    secret: env.BETTER_AUTH_SECRET,
    trustedOrigins: [origin],
    rateLimit: {
      enabled: true,
      storage: "database",
      customRules: {
        "/sign-up/email": {
          window: 60,
          max: 5,
        },
      },
    },
    emailAndPassword: {
      enabled: true,
      autoSignIn: false,
      requireEmailVerification: true,
      resetPasswordTokenExpiresIn: 60 * 60,
      sendResetPassword: ({ user, url }) =>
        sendAccountEmail(env, ctx, {
          kind: "password-reset",
          recipient: user.email,
          url,
        }),
    },
    emailVerification: {
      autoSignInAfterVerification: false,
      expiresIn: 60 * 60,
      sendOnSignIn: false,
      sendOnSignUp: true,
      sendVerificationEmail: ({ user, url }) =>
        sendAccountEmail(env, ctx, {
          kind: "verification",
          recipient: user.email,
          url,
        }),
    },
    advanced: {
      ipAddress: {
        ipAddressHeaders: ["cf-connecting-ip"],
      },
      database: {
        generateId: "uuid",
      },
    },
  })
}
