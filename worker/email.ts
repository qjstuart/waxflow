import { Resend } from "resend"

type AccountEmailKind = "verification" | "password-reset"

interface AccountEmailMessage {
  kind: AccountEmailKind
  recipient: string
  url: string
}

function buildAccountEmailContent(
  kind: AccountEmailKind,
  url: string,
): { subject: string; text: string } {
  switch (kind) {
    case "verification":
      return {
        subject: "Verify your Waxflow Account",
        text: [
          "Verify your email address to finish creating your Waxflow Account.",
          "",
          url,
          "",
          "If you did not create this Account, you can ignore this message.",
        ].join("\n"),
      }
    case "password-reset":
      return {
        subject: "Reset your Waxflow password",
        text: [
          "Use this link to choose a new password for your Waxflow Account.",
          "",
          url,
          "",
          "If you did not request a password reset, you can ignore this message.",
        ].join("\n"),
      }
  }
}

export async function sendAccountEmail(
  env: Env,
  ctx: ExecutionContext,
  message: AccountEmailMessage,
): Promise<void> {
  const { subject, text } = buildAccountEmailContent(message.kind, message.url)

  if (env.EMAIL_DELIVERY_MODE === "capture") {
    await env.DB.prepare(
      `INSERT INTO test_email
        (id, recipient, subject, text, actionUrl, kind, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        crypto.randomUUID(),
        message.recipient,
        subject,
        text,
        message.url,
        message.kind,
        Date.now(),
      )
      .run()
    return
  }

  ctx.waitUntil(
    (async () => {
      try {
        if (!env.RESEND_API_KEY || !env.EMAIL_FROM) {
          throw new Error("Resend email sending is not configured")
        }

        const { error } = await new Resend(env.RESEND_API_KEY).emails.send({
          from: env.EMAIL_FROM,
          to: message.recipient,
          subject,
          text,
        })

        if (error) {
          throw new Error(
            `Resend rejected the account message: ${error.message}`,
          )
        }
      } catch (error: unknown) {
        console.error(
          JSON.stringify({
            message: `${message.kind} email send failed`,
            error: error instanceof Error ? error.message : String(error),
          }),
        )
      }
    })(),
  )
}
