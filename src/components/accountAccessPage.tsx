import { AccountAccessPanel } from "@/components/accountAccessPanel"

type AccountAccessPageProps = {
  onSignedIn: () => unknown | Promise<unknown>
}

const eyebrowClassName =
  "mb-[0.9rem] font-mono text-xs tracking-[0.13em] text-brand-orange uppercase"
const wordmarkClassName =
  "font-mono text-[1.05rem] font-medium tracking-[-0.06em] no-underline"

export function AccountAccessPage({ onSignedIn }: AccountAccessPageProps) {
  return (
    <main className="grid min-h-screen min-[761px]:grid-cols-[minmax(320px,0.92fr)_minmax(420px,1.08fr)]">
      <section className="flex min-h-60 flex-col justify-between bg-[radial-gradient(circle_at_78%_18%,rgb(239_90_50/80%),transparent_24%),linear-gradient(145deg,#251645_0%,var(--brand-purple)_58%,#6b365b_100%)] px-5 pt-6 pb-8 text-brand-cream min-[761px]:min-h-screen min-[761px]:px-[clamp(2rem,5vw,5.5rem)] min-[761px]:pt-[2.2rem] min-[761px]:pb-[4.5rem]">
        <a className={wordmarkClassName} href="/">
          waxflow
        </a>
        <div>
          <p className={`${eyebrowClassName} text-[#ffb297]`}>
            DJ Transition Memory
          </p>
          <h1 className="mt-12 max-w-[12ch] text-[clamp(2.6rem,13vw,4rem)] leading-[0.91] font-bold tracking-[-0.07em] min-[761px]:mt-0 min-[761px]:max-w-[9ch] min-[761px]:text-[clamp(3.1rem,6.2vw,6.7rem)]">
            Remember the mixes that move you.
          </h1>
          <p className="mt-8 hidden max-w-[38rem] text-[1.05rem] leading-[1.65] text-brand-cream/70 min-[761px]:block">
            Keep a private Library of Tracks and the personally tested
            Transitions between them.
          </p>
        </div>
      </section>
      <section className="grid place-items-center px-5 pt-[2.8rem] pb-16 min-[761px]:px-[clamp(1.5rem,7vw,7rem)] min-[761px]:py-12">
        <div className="w-[min(100%,31rem)]">
          <AccountAccessPanel onSignedIn={onSignedIn} />
        </div>
      </section>
    </main>
  )
}
