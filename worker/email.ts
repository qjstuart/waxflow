import { Resend } from 'resend'

interface VerificationMessage {
  recipient: string
  url: string
}

export async function deliverVerificationEmail(
  env: Env,
  message: VerificationMessage,
): Promise<void> {
  const subject = 'Verify your Waxflow Account'
  const text = [
    'Verify your email address to finish creating your Waxflow Account.',
    '',
    message.url,
    '',
    'If you did not create this Account, you can ignore this message.',
  ].join('\n')

  if (env.EMAIL_DELIVERY_MODE === 'capture') {
    await env.DB.prepare(
      `INSERT INTO test_email
        (id, recipient, subject, text, verificationUrl, createdAt)
       VALUES (?, ?, ?, ?, ?, ?)`,
    )
      .bind(crypto.randomUUID(), message.recipient, subject, text, message.url, Date.now())
      .run()
    return
  }

  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) {
    throw new Error('Resend email delivery is not configured')
  }

  const { error } = await new Resend(env.RESEND_API_KEY).emails.send({
    from: env.EMAIL_FROM,
    to: message.recipient,
    subject,
    text,
  })

  if (error) {
    throw new Error(`Resend rejected the verification message: ${error.message}`)
  }
}
