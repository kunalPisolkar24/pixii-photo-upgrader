export function isLocalEnvironment(hostname?: string): boolean {
  if (process.env.NEXT_PUBLIC_FORCE_RATE_LIMIT === "true") {
    return false
  }

  if (process.env.NODE_ENV === "development") {
    return true
  }

  if (typeof window !== "undefined") {
    const currentHostname = window.location.hostname
    return (
      currentHostname === "localhost" ||
      currentHostname === "127.0.0.1" ||
      currentHostname.startsWith("0.0.0.0")
    )
  }

  if (hostname) {
    return hostname === "localhost" || hostname === "127.0.0.1"
  }

  return false
}
