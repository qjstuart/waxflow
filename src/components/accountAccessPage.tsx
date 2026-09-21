import { AccountAccessPanel } from "@/components/accountAccessPanel"
import {
  AccountAccessEyebrow,
  AccountAccessTitle,
} from "@/components/accountAccessPresentation"

type AccountAccessPageProps = {
  onSignedIn: () => unknown | Promise<unknown>
}

export function AccountAccessPage({ onSignedIn }: AccountAccessPageProps) {
  return (
    <main className="grid min-h-screen md:grid-cols-2">
      <section className="bg-account-access-hero flex min-h-60 flex-col justify-between px-5 pt-6 pb-8 text-brand-cream md:min-h-screen md:px-12 md:py-10 lg:px-20 lg:pb-18">
        <a
          className="font-mono text-lg font-medium tracking-tighter no-underline"
          href="/"
        >
          waxflow
        </a>
        <div>
          <AccountAccessEyebrow tone="hero">
            DJ Transition Memory
          </AccountAccessEyebrow>
          <AccountAccessTitle as="h1" scale="hero">
            Remember the mixes that move you.
          </AccountAccessTitle>
          <p className="mt-8 hidden max-w-xl text-lg leading-relaxed text-brand-cream/70 md:block">
            Keep a private Library of Tracks and the personally tested
            Transitions between them.
          </p>
        </div>
      </section>
      <section className="grid place-items-center px-5 py-12 pb-16 md:px-12 lg:px-20">
        <div className="w-full max-w-lg">
          <AccountAccessPanel onSignedIn={onSignedIn} />
        </div>
      </section>
    </main>
  )
}
