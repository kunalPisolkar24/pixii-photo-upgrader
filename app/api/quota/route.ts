import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { ratelimit } from "@/lib/services/rate-limiter.service"
import { isLocalEnvironment } from "@/lib/environment"

export async function GET(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")
  const ip = forwarded ? forwarded.split(",")[0] : (request.headers.get("x-real-ip") ?? "127.0.0.1")
  
  const isLocal = isLocalEnvironment(request.nextUrl.hostname)

  if (isLocal) {
    return NextResponse.json({
      limit: 3,
      remaining: 3,
      reset: 0,
    })
  }

  const { remaining, reset } = await ratelimit.getRemaining(ip)

  return NextResponse.json({
    limit: 3,
    remaining,
    reset,
  })
}
