import { Button } from "@/components/ui/button"

export const eyebrowClassName =
  "mb-[0.9rem] font-mono text-xs tracking-[0.13em] text-brand-orange uppercase"
export const headingClassName = "mb-8 leading-none tracking-[-0.055em] font-bold"
export const textButtonClassName =
  "h-auto rounded-none p-0 font-bold text-brand-purple underline underline-offset-[0.18em] hover:bg-transparent hover:text-brand-purple"

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
      <p className={eyebrowClassName}>{eyebrow}</p>
      <h2 className={`${headingClassName} text-[clamp(2rem,4vw,3.8rem)]`}>
        {heading}
      </h2>
    </>
  )
}

export function AccountAccessNotice({ message }: { message: string }) {
  return (
    <p
      className="mb-[1.4rem] border-l-[3px] border-brand-orange bg-brand-orange/10 px-4 py-[0.8rem] leading-normal"
      role="status"
    >
      {message}
    </p>
  )
}

export function AccountAccessError({ message }: { message: string }) {
  return (
    <p
      className="mb-[1.4rem] border-l-[3px] border-destructive bg-destructive/10 px-4 py-[0.8rem] leading-normal"
      role="alert"
    >
      {message}
    </p>
  )
}

type BackToSignInProps = {
  className?: string
  onClick: () => void
}

export function BackToSignIn({
  className = textButtonClassName,
  onClick,
}: BackToSignInProps) {
  return (
    <Button variant="link" className={className} onClick={onClick}>
      Back to sign in
    </Button>
  )
}
