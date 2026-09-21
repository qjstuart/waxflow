import { type FormEvent, useState } from "react"

import { authClient } from "@/auth-client"
import {
  CredentialsView,
  EmailSentView,
  PasswordRecoveryRequestView,
  ResetPasswordView,
} from "@/components/accountAccessViews"

type AccountAccessView =
  | "sign-in"
  | "register"
  | "check-email"
  | "request-reset"
  | "reset-email-sent"
  | "reset-password"

type AccountAccessPanelProps = {
  onSignedIn: () => unknown | Promise<unknown>
}

function readVerificationNotice(): string | null {
  const params = new URLSearchParams(window.location.search)
  return params.get("verified") === "true" && !params.has("error")
    ? "Email verified. Sign in to open your Library."
    : null
}

function readAccountAccessError(): string | null {
  const params = new URLSearchParams(window.location.search)
  if (params.get("reset") === "true" && params.has("error")) {
    return "This password reset link is invalid, expired, or has already been used."
  }
  if (params.has("error")) {
    return "This verification link is invalid or has expired. Request a new message by signing in again."
  }
  return null
}

function readInitialView(): AccountAccessView {
  const params = new URLSearchParams(window.location.search)
  return params.get("reset") === "true" && params.has("token")
    ? "reset-password"
    : "sign-in"
}

function readResetToken(): string | null {
  return new URLSearchParams(window.location.search).get("token")
}

export function AccountAccessPanel({ onSignedIn }: AccountAccessPanelProps) {
  const [view, setView] = useState<AccountAccessView>(readInitialView)
  const [resetToken, setResetToken] = useState<string | null>(readResetToken)
  const [notice, setNotice] = useState<string | null>(readVerificationNotice)
  const [error, setError] = useState<string | null>(readAccountAccessError)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function returnToSignIn() {
    setError(null)
    setView("sign-in")
  }

  async function register(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    const data = new FormData(event.currentTarget)
    const email = String(data.get("email"))
    const password = String(data.get("password"))

    const result = await authClient.signUp.email({
      callbackURL: "/?verified=true",
      email,
      name: email,
      password,
    })

    setIsSubmitting(false)
    if (result.error) {
      setError(
        result.error.status === 429
          ? "Too many attempts. Wait a moment and try again."
          : "We could not create that account. Check the details and try again.",
      )
      return
    }

    setView("check-email")
    setNotice(
      "If an Account can be created with that email address, we’ll send you a verification message.",
    )
  }

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setNotice(null)
    setIsSubmitting(true)
    const data = new FormData(event.currentTarget)

    const result = await authClient.signIn.email({
      callbackURL: "/?verified=true",
      email: String(data.get("email")),
      password: String(data.get("password")),
    })

    setIsSubmitting(false)
    if (result.error) {
      setError(
        result.error.status === 429
          ? "Too many attempts. Wait a moment and try again."
          : result.error.status === 403
            ? "Check your email to verify your account."
            : "Email or password is incorrect.",
      )
      return
    }

    await onSignedIn()
  }

  async function requestPasswordReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setNotice(null)
    setIsSubmitting(true)
    const data = new FormData(event.currentTarget)

    const result = await authClient.requestPasswordReset({
      email: String(data.get("email")),
      redirectTo: "/?reset=true",
    })

    setIsSubmitting(false)
    if (result.error) {
      setError(
        result.error.status === 429
          ? "Too many attempts. Wait a moment and try again."
          : "We could not start password recovery. Try again.",
      )
      return
    }

    setView("reset-email-sent")
    setNotice(
      "If an Account uses that email address, we’ll send a password reset message.",
    )
  }

  async function resetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setNotice(null)

    if (!resetToken) {
      setError(
        "This password reset link is invalid, expired, or has already been used.",
      )
      return
    }

    setIsSubmitting(true)
    const data = new FormData(event.currentTarget)
    const result = await authClient.resetPassword({
      newPassword: String(data.get("password")),
      token: resetToken,
    })

    setIsSubmitting(false)
    if (result.error) {
      setError(
        result.error.code === "PASSWORD_TOO_SHORT" ||
          result.error.code === "PASSWORD_TOO_LONG"
          ? "Use a password between 8 and 128 characters."
          : "This password reset link is invalid, expired, or has already been used.",
      )
      return
    }

    window.history.replaceState({}, "", "/")
    setResetToken(null)
    setView("sign-in")
    setNotice("Password updated. Sign in with your new password.")
  }

  if (view === "check-email") {
    return (
      <EmailSentView
        eyebrow="One last step"
        message={notice!}
        body="Open the link in the message, then come back to sign in."
        onBackToSignIn={returnToSignIn}
      />
    )
  }

  if (view === "reset-email-sent") {
    return (
      <EmailSentView
        eyebrow="Password recovery"
        message={notice!}
        body="Open the link in the message to choose a new password."
        onBackToSignIn={returnToSignIn}
      />
    )
  }

  if (view === "request-reset") {
    return (
      <PasswordRecoveryRequestView
        error={error}
        isSubmitting={isSubmitting}
        onSubmit={requestPasswordReset}
        onBackToSignIn={returnToSignIn}
      />
    )
  }

  if (view === "reset-password") {
    return (
      <ResetPasswordView
        error={error}
        isSubmitting={isSubmitting}
        onSubmit={resetPassword}
      />
    )
  }

  const isRegistering = view === "register"
  return (
    <CredentialsView
      isRegistering={isRegistering}
      notice={notice}
      error={error}
      isSubmitting={isSubmitting}
      onSubmit={isRegistering ? register : signIn}
      onForgotPassword={() => {
        setError(null)
        setNotice(null)
        setView("request-reset")
      }}
      onToggleMode={() => {
        setError(null)
        setNotice(null)
        setView(isRegistering ? "sign-in" : "register")
      }}
    />
  )
}
