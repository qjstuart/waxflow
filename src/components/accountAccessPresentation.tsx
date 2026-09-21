import type { ComponentProps, ElementType, ReactNode } from "react"
import { cva } from "class-variance-authority"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const eyebrowVariants = cva(
  "mb-4 font-mono text-xs tracking-widest uppercase",
  {
    variants: {
      tone: {
        default: "text-eyebrow",
        hero: "text-brand-orange-soft",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  },
)

type AccountAccessEyebrowProps = {
  children: ReactNode
  tone?: "default" | "hero"
}

export function AccountAccessEyebrow({
  children,
  tone,
}: AccountAccessEyebrowProps) {
  return <p className={eyebrowVariants({ tone })}>{children}</p>
}

const titleVariants = cva("leading-none font-bold tracking-tighter", {
  variants: {
    scale: {
      hero: "mt-12 max-w-xs text-5xl md:mt-0 md:text-7xl lg:text-8xl",
      panel: "mb-8 text-4xl md:text-6xl",
    },
  },
})

type AccountAccessTitleProps = {
  as: ElementType
  children: ReactNode
  scale: "hero" | "panel"
}

export function AccountAccessTitle({
  as: Title,
  children,
  scale,
}: AccountAccessTitleProps) {
  return <Title className={titleVariants({ scale })}>{children}</Title>
}

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
      <AccountAccessEyebrow>{eyebrow}</AccountAccessEyebrow>
      <AccountAccessTitle as="h2" scale="panel">
        {heading}
      </AccountAccessTitle>
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
      variant="link"
      className={cn(
        "h-auto p-0 font-bold text-accent underline decoration-1 underline-offset-4 hover:text-accent/80",
        className,
      )}
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
      className={cn(
        "mt-2 min-h-12 px-5 py-3 font-bold hover:bg-accent",
        className,
      )}
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
        className="min-h-12 bg-card/60 px-4 py-3 text-base md:text-base"
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
