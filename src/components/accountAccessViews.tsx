import type { FormEventHandler } from "react"

import {
  AccountAccessError,
  AccountAccessHeader,
  AccountAccessNotice,
  BackToSignIn,
  textButtonClassName,
} from "@/components/accountAccessPresentation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const inputClassName =
  "min-h-[3.2rem] rounded-none bg-white/55 px-[0.9rem] py-3 text-base focus-visible:border-brand-purple focus-visible:ring-brand-purple/15 md:text-base"
const submitButtonClassName =
  "mt-2 min-h-13 rounded-none px-5 py-[0.85rem] font-bold hover:bg-brand-purple disabled:cursor-wait"

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
      <form className="grid gap-[1.2rem]" onSubmit={onSubmit}>
        <Label className="grid gap-[0.55rem] text-[0.82rem] font-bold">
          Email address
          <Input
            className={inputClassName}
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </Label>
        <Button
          className={submitButtonClassName}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Working…" : "Send reset link"}
        </Button>
      </form>
      <BackToSignIn
        className={`${textButtonClassName} mt-6`}
        onClick={onBackToSignIn}
      />
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
      <form className="grid gap-[1.2rem]" onSubmit={onSubmit}>
        <Label className="grid gap-[0.55rem] text-[0.82rem] font-bold">
          New password
          <Input
            className={inputClassName}
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={128}
            required
          />
        </Label>
        <Button
          className={submitButtonClassName}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Working…" : "Save new password"}
        </Button>
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
      <form className="grid gap-[1.2rem]" onSubmit={onSubmit}>
        <Label className="grid gap-[0.55rem] text-[0.82rem] font-bold">
          Email address
          <Input
            className={inputClassName}
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </Label>
        <Label className="grid gap-[0.55rem] text-[0.82rem] font-bold">
          Password
          <Input
            className={inputClassName}
            name="password"
            type="password"
            autoComplete={isRegistering ? "new-password" : "current-password"}
            minLength={8}
            required
          />
        </Label>
        <Button
          className={submitButtonClassName}
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
          onClick={onForgotPassword}
        >
          Forgot your password?
        </Button>
      )}
      <p className="mt-6 text-sm">
        {isRegistering ? "Already have an Account?" : "New to Waxflow?"}{" "}
        <Button
          variant="link"
          className={textButtonClassName}
          onClick={onToggleMode}
        >
          {isRegistering ? "Sign in" : "Create an Account"}
        </Button>
      </p>
    </>
  )
}
