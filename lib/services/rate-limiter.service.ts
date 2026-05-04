import { Ratelimit } from "@upstash/ratelimit"
import { redis } from "../infrastructure/redis"

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "24 h"),
  analytics: true,
})

import { isLocalEnvironment } from "../environment"

export async function checkRateLimit(ip: string, hostname?: string) {
  const isLocal = isLocalEnvironment(hostname)
  
  const result = await ratelimit.limit(ip)
  
  if (isLocal) {
    return {
      success: true,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    }
  }

  return result
}
