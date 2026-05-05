import { Ratelimit } from "@upstash/ratelimit"
import { getRedis } from "../infrastructure/redis"
import { isLocalEnvironment } from "../environment"

const LIMIT = 3

let ratelimit: Ratelimit | null = null

function getRatelimit() {
  if (ratelimit) {
    return ratelimit
  }

  ratelimit = new Ratelimit({
    redis: getRedis(),
    limiter: Ratelimit.slidingWindow(LIMIT, "24 h"),
    analytics: true,
  })

  return ratelimit
}

export function getLocalRateLimitResult() {
  return {
    success: true,
    limit: LIMIT,
    remaining: LIMIT,
    reset: 0,
    pending: Promise.resolve(),
  }
}

export async function getRemainingQuota(ip: string, hostname?: string) {
  try {
    const { limit, remaining, reset } = await getRatelimit().getRemaining(ip)
    return { limit, remaining, reset }
  } catch (error) {
    console.error("[RateLimiter] Redis fetch error:", error)
    return getLocalRateLimitResult()
  }
}

export async function checkRateLimit(ip: string, hostname?: string) {
  const isLocal = isLocalEnvironment(hostname)

  try {
    const result = await getRatelimit().limit(ip)
    
    if (isLocal) {
      return { ...result, success: true }
    }
    
    return result
  } catch (error) {
    console.error("[RateLimiter] Redis limit error:", error)
    return { ...getLocalRateLimitResult(), success: true }
  }
}
