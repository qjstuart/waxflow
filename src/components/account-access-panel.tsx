import { type FormEvent, useState } from "react"

import { authClient } from "@/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type AccountAccessView = "sign-in" | "register" | "check-email"

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

function readVerificationError(): string | null {
  const params = new URLSearchParams(window.location.search)
  if (params.has("error")) {
    return "This verification link is invalid or has expired. Request a new message by signing in again."
  }
  return null
}

export function AccountAccessPanel({ onSignedIn }: AccountAccessPanelProps) {
  const [view, setView] = useState<AccountAccessView>("sign-in")
  const [notice, setNotice] = useState<string | null>(readVerificationNotice)
  const [error, setError] = useState<string | null>(readVerificationError)
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
