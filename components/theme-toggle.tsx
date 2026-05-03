"use client"

import { useSyncExternalStore } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

const subscribe = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

export function ThemeToggle() {
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  )
  const { resolvedTheme, setTheme } = useTheme()

  const isDark = resolvedTheme === "dark"
  const nextTheme = isDark ? "light" : "dark"
  const label = isDark ? "Switch to light mode" : "Switch to dark mode"
  const Icon = isDark ? Sun : Moon

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className="rounded-full text-muted-foreground hover:text-foreground"
      onClick={() => setTheme(nextTheme)}
      disabled={!mounted}
      aria-label={mounted ? label : "Loading theme toggle"}
      title={mounted ? label : "Loading theme toggle"}
    >
      {mounted ? <Icon className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}
