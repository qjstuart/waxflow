import type { ChangeEvent } from "react"

import { type ThemePreference, useTheme } from "@/theme"

export function ThemeControl() {
  const { preference, setPreference } = useTheme()

  function selectTheme(event: ChangeEvent<HTMLSelectElement>) {
    setPreference(event.currentTarget.value as ThemePreference)
  }

  return (
    <label className="flex items-center gap-2 rounded-lg border bg-card py-1 pr-1 pl-2 text-xs font-bold text-card-foreground">
      <span>Theme</span>
      <select
        className="rounded-md border bg-secondary px-2 py-1.5 text-secondary-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring"
        value={preference}
        onChange={selectTheme}
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  )
}
