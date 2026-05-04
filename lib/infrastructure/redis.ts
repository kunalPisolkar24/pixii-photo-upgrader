import { Redis } from "@upstash/redis"

let redis: Redis | null = null

export function getRedis() {
  if (redis) {
    return redis
  }

  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    throw new Error("Missing Upstash Redis configuration")
  }

  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })

  return redis
}
