import { useState } from "react"

import { Eyebrow, Wordmark } from "@/components/appPresentation"
import { ThemeControl } from "@/components/themeControl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type LibrarySearchPageProps = {
  email: string
  onSignOut: () => unknown | Promise<unknown>
}

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
      <header className="flex min-h-18 flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b bg-navigation px-5 py-3 md:px-12 lg:px-20">
        <Wordmark href="/" aria-label="Waxflow home" />
        <div className="flex items-center gap-3 text-sm md:gap-4">
          <span className="hidden lg:inline">{email}</span>
          <ThemeControl />
          <Button
            variant="secondary"
            size="navigation"
            onClick={signOut}
            disabled={isSigningOut}
          >
            Sign out
          </Button>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-5 py-14 md:px-12 md:py-24 lg:px-20">
        <Eyebrow className="mb-4">Your private memory aid</Eyebrow>
        <h1 className="mb-8 text-4xl leading-none font-bold tracking-tighter md:text-6xl lg:text-7xl">
          Library Search
        </h1>
        <Label className="block">
          <span className="sr-only">Search your Library</span>
          <Input
            variant="search"
            type="search"
            placeholder="Search artist, title, or notes"
          />
        </Label>
        <section
          className="mt-6 grid place-items-center rounded-lg border bg-empty-state px-6 py-14 text-center md:py-20"
          aria-labelledby="empty-title"
        >
          <div
            className="grid size-20 place-items-center rounded-full bg-brand-purple shadow-empty-state-mark"
            aria-hidden="true"
          >
            <span className="size-3 rounded-full bg-brand-orange" />
          </div>
          <h2
            id="empty-title"
            className="mt-6 mb-2 text-2xl font-bold"
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
