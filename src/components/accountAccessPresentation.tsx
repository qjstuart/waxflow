import type { ComponentProps, ReactNode } from "react"
import { cva } from "class-variance-authority"

import { Eyebrow } from "@/components/appPresentation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

type AccountAccessHeaderProps = {
  eyebrow: string
  heading: string
}

export function AccountAccessHeader({
  eyebrow,
  heading,
}: AccountAccessHeaderProps) {
  return (
    <>
      <Eyebrow className="mb-4">{eyebrow}</Eyebrow>
      <h2 className="mb-8 text-[clamp(2.25rem,4vw,3.75rem)] leading-none font-bold tracking-tighter">
        {heading}
      </h2>
    </>
  )
}

const feedbackVariants = cva("mb-6 border-l-4 px-4 py-3 leading-normal", {
  variants: {
    tone: {
      error: "border-destructive bg-destructive/10",
      notice: "border-notice bg-notice/10",
    },
  },
})

type AccountAccessFeedbackProps = {
  message: string
  tone: "error" | "notice"
}

function AccountAccessFeedback({
  message,
  tone,
}: AccountAccessFeedbackProps) {
  return (
    <p
      className={feedbackVariants({ tone })}
      role={tone === "error" ? "alert" : "status"}
    >
      {message}
    </p>
  )
}

export function AccountAccessNotice({ message }: { message: string }) {
  return <AccountAccessFeedback message={message} tone="notice" />
}

export function AccountAccessError({ message }: { message: string }) {
  return <AccountAccessFeedback message={message} tone="error" />
}

type BackToSignInProps = {
  className?: string
  onClick: () => void
}

export function AccountAccessTextButton({
  className,
  ...props
}: ComponentProps<typeof Button>) {
  return (
    <Button
      variant="accentLink"
      size="content"
      className={className}
      {...props}
    />
  )
}

export function AccountAccessSubmitButton({
  className,
  ...props
}: ComponentProps<typeof Button>) {
  return (
    <Button
      variant="submit"
      size="form"
      className={cn("mt-2", className)}
      type="submit"
      {...props}
    />
  )
}

type AccountAccessFieldProps = Omit<
  ComponentProps<typeof Input>,
  "children" | "className"
> & {
  children: ReactNode
}

export function AccountAccessField({
  children,
  ...props
}: AccountAccessFieldProps) {
  return (
    <Label className="grid gap-2 text-sm font-bold">
      {children}
      <Input
        variant="form"
        {...props}
      />
    </Label>
  )
}

export function BackToSignIn({ className, onClick }: BackToSignInProps) {
  return (
    <AccountAccessTextButton className={className} onClick={onClick}>
      Back to sign in
    </AccountAccessTextButton>
  )
}
