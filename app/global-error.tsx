"use client"

import { AlertCircle } from "lucide-react"

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex h-screen w-full flex-col items-center justify-center gap-6 p-4 bg-background">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
          <div className="space-y-2 text-center max-w-md">
            <h1 className="text-2xl font-semibold tracking-tight">Critical Error</h1>
            <p className="text-muted-foreground">
              A critical system error has occurred. Please refresh the page or try again later.
            </p>
          </div>
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
