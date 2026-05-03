import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { ratelimit } from "@/lib/services/rate-limiter.service"

export async function GET(request: NextRequest) {
  const ip = request.ip ?? "127.0.0.1"
  const { remaining, reset } = await ratelimit.getRemaining(ip)

  return NextResponse.json({
    limit: 3,
    remaining,
    reset,
  })
}
