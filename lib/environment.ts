export function isLocalEnvironment(hostname?: string): boolean {
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

  return process.env.NODE_ENV === "development"
}
