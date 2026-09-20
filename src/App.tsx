import { useEffect, useState } from "react"

import { authClient } from "@/auth-client"
import { AccountAccessPage } from "@/components/accountAccessPage"
import { LibrarySearchPage } from "@/components/librarySearchPage"

function App() {
  const session = authClient.useSession()
  const [isInitializingSession, setIsInitializingSession] = useState(
    session.isPending,
  )

  useEffect(() => {
    if (!session.isPending) {
      setIsInitializingSession(false)
    }
  }, [session.isPending])

  async function signOut() {
    const result = await authClient.signOut()
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
      <LibrarySearchPage
        email={session.data.user.email}
        onSignOut={signOut}
      />
    )
  }

  return <AccountAccessPage onSignedIn={() => session.refetch()} />
}

export default App
