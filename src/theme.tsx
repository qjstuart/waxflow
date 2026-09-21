import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react"

export type ThemePreference = "system" | "light" | "dark"

const THEME_STORAGE_KEY = "waxflow-theme"
const SYSTEM_DARK_QUERY = "(prefers-color-scheme: dark)"

type ThemeContextValue = {
  preference: ThemePreference
  setPreference: (preference: ThemePreference) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function isThemePreference(value: unknown): value is ThemePreference {
  return value === "system" || value === "light" || value === "dark"
}

function readInitialPreference(): ThemePreference {
  const preference = document.documentElement.dataset.themePreference
  return isThemePreference(preference) ? preference : "system"
}

function resolveTheme(preference: ThemePreference): "light" | "dark" {
  if (preference !== "system") {
    return preference
  }

  return window.matchMedia(SYSTEM_DARK_QUERY).matches ? "dark" : "light"
}

function applyTheme(preference: ThemePreference) {
  const resolvedTheme = resolveTheme(preference)
  document.documentElement.dataset.theme = resolvedTheme
  document.documentElement.dataset.themePreference = preference
  document.documentElement.style.colorScheme = resolvedTheme
}

function persistPreference(preference: ThemePreference) {
  try {
    if (preference === "system") {
      window.localStorage.removeItem(THEME_STORAGE_KEY)
    } else {
      window.localStorage.setItem(THEME_STORAGE_KEY, preference)
    }
  } catch {
    // The active page still follows the choice when storage is unavailable.
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState(readInitialPreference)

  useEffect(() => {
    const colorScheme = window.matchMedia(SYSTEM_DARK_QUERY)

    function followSystemTheme() {
      if (preference === "system") {
        applyTheme(preference)
      }
    }

    applyTheme(preference)
    colorScheme.addEventListener("change", followSystemTheme)
    return () => colorScheme.removeEventListener("change", followSystemTheme)
  }, [preference])

  function setPreference(nextPreference: ThemePreference) {
    applyTheme(nextPreference)
    persistPreference(nextPreference)
    setPreferenceState(nextPreference)
  }

  return (
    <ThemeContext value={{ preference, setPreference }}>
      {children}
    </ThemeContext>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}
