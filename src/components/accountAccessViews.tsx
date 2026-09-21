import type { FormEventHandler } from "react"

import {
  AccountAccessError,
  AccountAccessField,
  AccountAccessHeader,
  AccountAccessNotice,
  AccountAccessSubmitButton,
  AccountAccessTextButton,
  BackToSignIn,
} from "@/components/accountAccessPresentation"

type EmailSentViewProps = {
  eyebrow: string
  message: string
  body: string
  onBackToSignIn: () => void
}

export function EmailSentView({
  eyebrow,
  message,
  body,
  onBackToSignIn,
}: EmailSentViewProps) {
  return (
    <>
      <AccountAccessHeader eyebrow={eyebrow} heading="Check your email" />
      <AccountAccessNotice message={message} />
      <p>{body}</p>
      <BackToSignIn onClick={onBackToSignIn} />
    </>
  )
}

type PasswordRecoveryRequestViewProps = {
  error: string | null
  isSubmitting: boolean
  onSubmit: FormEventHandler<HTMLFormElement>
  onBackToSignIn: () => void
}

export function PasswordRecoveryRequestView({
  error,
  isSubmitting,
  onSubmit,
  onBackToSignIn,
}: PasswordRecoveryRequestViewProps) {
  return (
    <>
      <AccountAccessHeader
        eyebrow="Password recovery"
        heading="Reset your password"
      />
      {error && <AccountAccessError message={error} />}
      <p className="mb-6">
        Enter your Account email address and we’ll send a reset link.
      </p>
      <form className="grid gap-5" onSubmit={onSubmit}>
        <AccountAccessField
          name="email"
          type="email"
          autoComplete="email"
          required
        >
          Email address
        </AccountAccessField>
        <AccountAccessSubmitButton disabled={isSubmitting}>
          {isSubmitting ? "Working…" : "Send reset link"}
        </AccountAccessSubmitButton>
      </form>
      <BackToSignIn className="mt-6" onClick={onBackToSignIn} />
    </>
  )
}

type ResetPasswordViewProps = {
  error: string | null
  isSubmitting: boolean
  onSubmit: FormEventHandler<HTMLFormElement>
}

export function ResetPasswordView({
  error,
  isSubmitting,
  onSubmit,
}: ResetPasswordViewProps) {
  return (
    <>
      <AccountAccessHeader
        eyebrow="Password recovery"
        heading="Choose a new password"
      />
      {error && <AccountAccessError message={error} />}
      <form className="grid gap-5" onSubmit={onSubmit}>
        <AccountAccessField
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          maxLength={128}
          required
        >
          New password
        </AccountAccessField>
        <AccountAccessSubmitButton disabled={isSubmitting}>
          {isSubmitting ? "Working…" : "Save new password"}
        </AccountAccessSubmitButton>
      </form>
    </>
  )
}

type CredentialsViewProps = {
  isRegistering: boolean
  notice: string | null
  error: string | null
  isSubmitting: boolean
  onSubmit: FormEventHandler<HTMLFormElement>
  onForgotPassword: () => void
  onToggleMode: () => void
}

export function CredentialsView({
  isRegistering,
  notice,
  error,
  isSubmitting,
  onSubmit,
  onForgotPassword,
  onToggleMode,
}: CredentialsViewProps) {
  return (
    <>
      <AccountAccessHeader
        eyebrow={isRegistering ? "Create your Account" : "Welcome back"}
        heading={isRegistering ? "Start your Library" : "Sign in to Waxflow"}
      />
      {notice && <AccountAccessNotice message={notice} />}
      {error && <AccountAccessError message={error} />}
      <form className="grid gap-5" onSubmit={onSubmit}>
        <AccountAccessField
          name="email"
          type="email"
          autoComplete="email"
          required
        >
          Email address
        </AccountAccessField>
        <AccountAccessField
          name="password"
          type="password"
          autoComplete={isRegistering ? "new-password" : "current-password"}
          minLength={8}
          required
        >
          Password
        </AccountAccessField>
        <AccountAccessSubmitButton disabled={isSubmitting}>
          {isSubmitting
            ? "Working…"
            : isRegistering
              ? "Create Account"
              : "Sign in"}
        </AccountAccessSubmitButton>
      </form>
      {!isRegistering && (
        <AccountAccessTextButton className="mt-4" onClick={onForgotPassword}>
          Forgot your password?
        </AccountAccessTextButton>
      )}
      <p className="mt-6 text-sm">
        {isRegistering ? "Already have an Account?" : "New to Waxflow?"}{" "}
        <AccountAccessTextButton onClick={onToggleMode}>
          {isRegistering ? "Sign in" : "Create an Account"}
        </AccountAccessTextButton>
      </p>
    </>
  )
}
