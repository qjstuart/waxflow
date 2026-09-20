import { useEffect, useState } from "react"

import { AccountAccessPanel } from "@/components/account-access-panel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/auth-client"

const eyebrowClassName =
  "mb-[0.9rem] font-mono text-xs tracking-[0.13em] text-brand-orange uppercase"
const headingClassName = "mb-8 leading-none tracking-[-0.055em] font-bold"
const wordmarkClassName =
  "font-mono text-[1.05rem] font-medium tracking-[-0.06em] no-underline"

function App() {
  const session = authClient.useSession()
  const [isInitializingSession, setIsInitializingSession] = useState(
    session.isPending,
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!session.isPending) {
      setIsInitializingSession(false)
    }
  }, [session.isPending])

  async function signOut() {
    setIsSubmitting(true)
    const result = await authClient.signOut()
    setIsSubmitting(false)
    if (result.error) {
      return
    }
    await session.refetch()
  }

  if (isInitializingSession) {
    return (
      <main className="grid min-h-screen place-items-center">
        Opening Waxflow…
      </main>
    )
  }

  if (session.data) {
    return (
      <div className="min-h-screen">
        <header className="flex min-h-[4.6rem] items-center justify-between border-b bg-background/90 px-5 min-[761px]:px-[4vw]">
          <a className={wordmarkClassName} href="/" aria-label="Waxflow home">
            waxflow
          </a>
          <div className="flex items-center gap-4 text-[0.82rem]">
            <span className="hidden min-[761px]:inline">
              {session.data.user.email}
            </span>
            <Button
              variant="secondary"
              className="h-auto min-h-0 rounded-none px-5 py-[0.85rem] font-bold"
              onClick={signOut}
              disabled={isSubmitting}
            >
              Sign out
            </Button>
          </div>
        </header>
        <main className="mx-auto w-[min(72rem,calc(100%-2.5rem))] py-14 min-[761px]:py-24">
          <p className={eyebrowClassName}>Your private memory aid</p>
          <h1 className={`${headingClassName} text-[clamp(2.2rem,5vw,4.6rem)]`}>
            Library Search
          </h1>
          <Label className="block">
            <span className="sr-only">Search your Library</span>
            <Input
              className="min-h-16 rounded-none border-foreground bg-white/55 px-5 text-[1.05rem] focus-visible:border-brand-purple focus-visible:ring-brand-purple/15 md:text-[1.05rem]"
              type="search"
              placeholder="Search artist, title, or notes"
            />
          </Label>
          <section
            className="mt-6 grid place-items-center border bg-white/40 px-6 py-14 text-center min-[761px]:py-20"
            aria-labelledby="empty-title"
          >
            <div
              className="grid size-20 place-items-center rounded-full bg-brand-purple shadow-[inset_0_0_0_1.25rem_rgb(255_255_255/8%)]"
              aria-hidden="true"
            >
              <span className="size-3 rounded-full bg-brand-orange" />
            </div>
            <h2 className="mt-[1.4rem] mb-[0.45rem] text-[1.45rem] font-bold">
              Your Library is empty
            </h2>
            <p className="text-muted-foreground">
              Add a Track when you’re ready to remember your first Transition.
            </p>
          </section>
        </main>
      </div>
    )
  }

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
          <AccountAccessPanel onSignedIn={() => session.refetch()} />
        </div>
      </section>
    </main>
  )
}

export default App
