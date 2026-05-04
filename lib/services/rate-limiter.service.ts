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
  }
}

export async function getRemainingQuota(ip: string, hostname?: string) {
  if (isLocalEnvironment(hostname)) {
    const { limit, remaining, reset } = getLocalRateLimitResult()
    return { limit, remaining, reset }
  }

  const { limit, remaining, reset } = await getRatelimit().getRemaining(ip)
  return { limit, remaining, reset }
}

export async function checkRateLimit(ip: string, hostname?: string) {
  if (isLocalEnvironment(hostname)) {
    return getLocalRateLimitResult()
  }

  return getRatelimit().limit(ip)
}
