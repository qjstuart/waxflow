import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type LibrarySearchPageProps = {
  email: string
  onSignOut: () => unknown | Promise<unknown>
}

const eyebrowClassName =
  "mb-[0.9rem] font-mono text-xs tracking-[0.13em] text-brand-orange uppercase"
const headingClassName = "mb-8 leading-none tracking-[-0.055em] font-bold"
const wordmarkClassName =
  "font-mono text-[1.05rem] font-medium tracking-[-0.06em] no-underline"

export function LibrarySearchPage({
  email,
  onSignOut,
}: LibrarySearchPageProps) {
  const [isSigningOut, setIsSigningOut] = useState(false)

  async function signOut() {
    setIsSigningOut(true)
    await onSignOut()
    setIsSigningOut(false)
  }

  return (
    <div className="min-h-screen">
      <header className="flex min-h-[4.6rem] items-center justify-between border-b bg-background/90 px-5 min-[761px]:px-[4vw]">
        <a className={wordmarkClassName} href="/" aria-label="Waxflow home">
          waxflow
        </a>
        <div className="flex items-center gap-4 text-[0.82rem]">
          <span className="hidden min-[761px]:inline">{email}</span>
          <Button
            variant="secondary"
            className="h-auto min-h-0 rounded-none px-5 py-[0.85rem] font-bold"
            onClick={signOut}
            disabled={isSigningOut}
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
          <h2
            id="empty-title"
            className="mt-[1.4rem] mb-[0.45rem] text-[1.45rem] font-bold"
          >
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
