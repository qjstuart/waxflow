import { type FormEvent, useEffect, useState } from "react"
import { authClient } from "./auth-client"
import "./App.css"

type AuthView = "sign-in" | "register" | "check-email"

function readVerificationNotice(): string | null {
  const params = new URLSearchParams(window.location.search)
  if (params.get("verified") === "true") {
    return "Email verified. Sign in to open your Library."
  }
  return null
}

function readVerificationError(): string | null {
  const params = new URLSearchParams(window.location.search)
  if (params.has("error")) {
    return "This verification link is invalid or has expired. Request a new message by signing in again."
  }
  return null
}

function App() {
  const session = authClient.useSession()
  const [view, setView] = useState<AuthView>("sign-in")
  const [notice, setNotice] = useState<string | null>(readVerificationNotice)
  const [error, setError] = useState<string | null>(readVerificationError)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (session.data) {
      setError(null)
      setNotice(null)
    }
  }, [session.data])

  async function register(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    const data = new FormData(event.currentTarget)
    const email = String(data.get("email"))
    const password = String(data.get("password"))

    const result = await authClient.signUp.email({
      callbackURL: "/?verified=true",
      email,
      name: email,
      password,
    })

    setIsSubmitting(false)
    if (result.error) {
      setError(
        "We could not create that Account. Check the details and try again.",
      )
      return
    }

    setView("check-email")
    setNotice(`We sent a verification message to ${email}.`)
  }

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setNotice(null)
    setIsSubmitting(true)
    const data = new FormData(event.currentTarget)

    const result = await authClient.signIn.email({
      email: String(data.get("email")),
      password: String(data.get("password")),
    })

    setIsSubmitting(false)
    if (result.error) {
      setError("Email or password is incorrect.")
      return
    }

    await session.refetch()
  }

  async function signOut() {
    setIsSubmitting(true)
    const result = await authClient.signOut()
    setIsSubmitting(false)
    if (result.error) {
      setError("We could not sign you out. Try again.")
      return
    }
    await session.refetch()
    setView("sign-in")
  }

  if (session.isPending) {
    return <main className="centered-status">Opening Waxflow…</main>
  }

  if (session.data) {
    return (
      <div className="app-shell">
        <header className="app-header">
          <a className="wordmark" href="/" aria-label="Waxflow home">
            waxflow
          </a>
          <div className="account-actions">
            <span>{session.data.user.email}</span>
            <button
              className="button button-quiet"
              onClick={signOut}
              disabled={isSubmitting}
            >
              Sign out
            </button>
          </div>
        </header>
        <main className="library">
          <p className="eyebrow">Your private memory aid</p>
          <h1>Library Search</h1>
          <label className="search-field">
            <span className="visually-hidden">Search your Library</span>
            <input type="search" placeholder="Search artist, title, or notes" />
          </label>
          <section className="empty-state" aria-labelledby="empty-title">
            <div className="record-mark" aria-hidden="true">
              <span />
            </div>
            <h2 id="empty-title">Your Library is empty</h2>
            <p>
              Add a Track when you’re ready to remember your first Transition.
            </p>
          </section>
        </main>
      </div>
    )
  }

  return (
    <main className="auth-layout">
      <section className="brand-panel">
        <a className="wordmark wordmark-light" href="/">
          waxflow
        </a>
        <div>
          <p className="eyebrow eyebrow-light">DJ Transition Memory</p>
          <h1>Remember the mixes that move you.</h1>
          <p className="brand-copy">
            Keep a private Library of Tracks and the personally tested
            Transitions between them.
          </p>
        </div>
      </section>
      <section className="auth-panel">
        <div className="auth-card">
          {view === "check-email" ? (
            <>
              <p className="eyebrow">One last step</p>
              <h2>Check your email</h2>
              {notice && (
                <p className="notice" role="status">
                  {notice}
                </p>
              )}
              <p>Open the link in the message, then come back to sign in.</p>
              <button
                className="text-button"
                onClick={() => setView("sign-in")}
              >
                Back to sign in
              </button>
            </>
          ) : (
            <>
              <p className="eyebrow">
                {view === "register" ? "Create your Account" : "Welcome back"}
              </p>
              <h2>
                {view === "register"
                  ? "Start your Library"
                  : "Sign in to Waxflow"}
              </h2>
              {notice && (
                <p className="notice" role="status">
                  {notice}
                </p>
              )}
              {error && (
                <p className="error" role="alert">
                  {error}
                </p>
              )}
              <form onSubmit={view === "register" ? register : signIn}>
                <label>
                  Email address
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                  />
                </label>
                <label>
                  Password
                  <input
                    name="password"
                    type="password"
                    autoComplete={
                      view === "register" ? "new-password" : "current-password"
                    }
                    minLength={8}
                    required
                  />
                </label>
                <button
                  className="button button-primary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Working…"
                    : view === "register"
                      ? "Create Account"
                      : "Sign in"}
                </button>
              </form>
              <p className="switch-view">
                {view === "register"
                  ? "Already have an Account?"
                  : "New to Waxflow?"}{" "}
                <button
                  className="text-button"
                  onClick={() => {
                    setError(null)
                    setNotice(null)
                    setView(view === "register" ? "sign-in" : "register")
                  }}
                >
                  {view === "register" ? "Sign in" : "Create an Account"}
                </button>
              </p>
            </>
          )}
        </div>
      </section>
    </main>
  )
}

export default App
