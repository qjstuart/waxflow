import { AccountAccessPanel } from "@/components/accountAccessPanel"
import { Eyebrow, Wordmark } from "@/components/appPresentation"

type AccountAccessPageProps = {
  onSignedIn: () => unknown | Promise<unknown>
}

export function AccountAccessPage({ onSignedIn }: AccountAccessPageProps) {
  return (
    <main className="grid min-h-screen md:grid-cols-2">
      <section className="bg-account-access-hero flex min-h-60 flex-col justify-between px-5 pt-6 pb-8 text-brand-cream md:min-h-screen md:px-12 md:py-10 lg:px-20 lg:pb-18">
        <Wordmark href="/" />
        <div>
          <Eyebrow className="mb-4" tone="hero">
            DJ Transition Memory
          </Eyebrow>
          <h1 className="mt-12 max-w-md text-[clamp(3rem,6vw,6rem)] leading-none font-bold tracking-tighter md:mt-0">
            Remember the mixes that move you.
          </h1>
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
