import { type FormEvent, useState } from "react"

import { authClient } from "@/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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

const eyebrowClassName =
  "mb-[0.9rem] font-mono text-xs tracking-[0.13em] text-brand-orange uppercase"
const headingClassName = "mb-8 leading-none tracking-[-0.055em] font-bold"
const textButtonClassName =
  "h-auto rounded-none p-0 font-bold text-brand-purple underline underline-offset-[0.18em] hover:bg-transparent hover:text-brand-purple"

function readVerificationNotice(): string | null {
  const params = new URLSearchParams(window.location.search)
  if (params.get("verified") === "true") {
    return "Email verified. Sign in to open your Library."
  }
  return null
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
      "If an account can be created with that email address, we’ll send you a verification message.",
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
      <>
        <p className={eyebrowClassName}>One last step</p>
        <h2 className={`${headingClassName} text-[clamp(2rem,4vw,3.8rem)]`}>
          Check your email
        </h2>
        {notice && (
          <p
            className="mb-[1.4rem] border-l-[3px] border-brand-orange bg-brand-orange/10 px-4 py-[0.8rem] leading-normal"
            role="status"
          >
            {notice}
          </p>
        )}
        <p>Open the link in the message, then come back to sign in.</p>
        <Button
          variant="link"
          className={textButtonClassName}
          onClick={() => setView("sign-in")}
        >
          Back to sign in
        </Button>
      </>
    )
  }

  if (view === "reset-email-sent") {
    return (
      <>
        <p className={eyebrowClassName}>Password recovery</p>
        <h2 className={`${headingClassName} text-[clamp(2rem,4vw,3.8rem)]`}>
          Check your email
        </h2>
        {notice && (
          <p
            className="mb-[1.4rem] border-l-[3px] border-brand-orange bg-brand-orange/10 px-4 py-[0.8rem] leading-normal"
            role="status"
          >
            {notice}
          </p>
        )}
        <p>Open the link in the message to choose a new password.</p>
        <Button
          variant="link"
          className={textButtonClassName}
          onClick={() => setView("sign-in")}
        >
          Back to sign in
        </Button>
      </>
    )
  }

  if (view === "request-reset") {
    return (
      <>
        <p className={eyebrowClassName}>Password recovery</p>
        <h2 className={`${headingClassName} text-[clamp(2rem,4vw,3.8rem)]`}>
          Reset your password
        </h2>
        {error && (
          <p
            className="mb-[1.4rem] border-l-[3px] border-destructive bg-destructive/10 px-4 py-[0.8rem] leading-normal"
            role="alert"
          >
            {error}
          </p>
        )}
        <p className="mb-6">
          Enter your Account email address and we’ll send a reset link.
        </p>
        <form className="grid gap-[1.2rem]" onSubmit={requestPasswordReset}>
          <Label className="grid gap-[0.55rem] text-[0.82rem] font-bold">
            Email address
            <Input
              className="min-h-[3.2rem] rounded-none bg-white/55 px-[0.9rem] py-3 text-base focus-visible:border-brand-purple focus-visible:ring-brand-purple/15 md:text-base"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </Label>
          <Button
            className="mt-2 min-h-13 rounded-none px-5 py-[0.85rem] font-bold hover:bg-brand-purple disabled:cursor-wait"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Working…" : "Send reset link"}
          </Button>
        </form>
        <Button
          variant="link"
          className={`${textButtonClassName} mt-6`}
          onClick={() => {
            setError(null)
            setView("sign-in")
          }}
        >
          Back to sign in
        </Button>
      </>
    )
  }

  if (view === "reset-password") {
    return (
      <>
        <p className={eyebrowClassName}>Password recovery</p>
        <h2 className={`${headingClassName} text-[clamp(2rem,4vw,3.8rem)]`}>
          Choose a new password
        </h2>
        {error && (
          <p
            className="mb-[1.4rem] border-l-[3px] border-destructive bg-destructive/10 px-4 py-[0.8rem] leading-normal"
            role="alert"
          >
            {error}
          </p>
        )}
        <form className="grid gap-[1.2rem]" onSubmit={resetPassword}>
          <Label className="grid gap-[0.55rem] text-[0.82rem] font-bold">
            New password
            <Input
              className="min-h-[3.2rem] rounded-none bg-white/55 px-[0.9rem] py-3 text-base focus-visible:border-brand-purple focus-visible:ring-brand-purple/15 md:text-base"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              maxLength={128}
              required
            />
          </Label>
          <Button
            className="mt-2 min-h-13 rounded-none px-5 py-[0.85rem] font-bold hover:bg-brand-purple disabled:cursor-wait"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Working…" : "Save new password"}
          </Button>
        </form>
      </>
    )
  }

  const isRegistering = view === "register"

  return (
    <>
      <p className={eyebrowClassName}>
        {isRegistering ? "Create your Account" : "Welcome back"}
      </p>
      <h2 className={`${headingClassName} text-[clamp(2rem,4vw,3.8rem)]`}>
        {isRegistering ? "Start your Library" : "Sign in to Waxflow"}
      </h2>
      {notice && (
        <p
          className="mb-[1.4rem] border-l-[3px] border-brand-orange bg-brand-orange/10 px-4 py-[0.8rem] leading-normal"
          role="status"
        >
          {notice}
        </p>
      )}
      {error && (
        <p
          className="mb-[1.4rem] border-l-[3px] border-destructive bg-destructive/10 px-4 py-[0.8rem] leading-normal"
          role="alert"
        >
          {error}
        </p>
      )}
      <form
        className="grid gap-[1.2rem]"
        onSubmit={isRegistering ? register : signIn}
      >
        <Label className="grid gap-[0.55rem] text-[0.82rem] font-bold">
          Email address
          <Input
            className="min-h-[3.2rem] rounded-none bg-white/55 px-[0.9rem] py-3 text-base focus-visible:border-brand-purple focus-visible:ring-brand-purple/15 md:text-base"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </Label>
        <Label className="grid gap-[0.55rem] text-[0.82rem] font-bold">
          Password
          <Input
            className="min-h-[3.2rem] rounded-none bg-white/55 px-[0.9rem] py-3 text-base focus-visible:border-brand-purple focus-visible:ring-brand-purple/15 md:text-base"
            name="password"
            type="password"
            autoComplete={isRegistering ? "new-password" : "current-password"}
            minLength={8}
            required
          />
        </Label>
        <Button
          className="mt-2 min-h-13 rounded-none px-5 py-[0.85rem] font-bold hover:bg-brand-purple disabled:cursor-wait"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Working…"
            : isRegistering
              ? "Create Account"
              : "Sign in"}
        </Button>
      </form>
      {!isRegistering && (
        <Button
          variant="link"
          className={`${textButtonClassName} mt-4`}
          onClick={() => {
            setError(null)
            setNotice(null)
            setView("request-reset")
          }}
        >
          Forgot your password?
        </Button>
      )}
      <p className="mt-6 text-sm">
        {isRegistering ? "Already have an Account?" : "New to Waxflow?"}{" "}
        <Button
          variant="link"
          className={textButtonClassName}
          onClick={() => {
            setError(null)
            setNotice(null)
            setView(isRegistering ? "sign-in" : "register")
          }}
        >
          {isRegistering ? "Sign in" : "Create an Account"}
        </Button>
      </p>
    </>
  )
}
