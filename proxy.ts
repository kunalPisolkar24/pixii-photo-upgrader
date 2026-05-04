import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { checkRateLimit } from "./lib/services/rate-limiter.service"

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/generate")) {
    const forwarded = request.headers.get("x-forwarded-for")
    const ip = forwarded ? forwarded.split(",")[0] : (request.headers.get("x-real-ip") ?? "127.0.0.1")
    const hostname = request.nextUrl.hostname
    const { success, limit, remaining, reset } = await checkRateLimit(ip, hostname)

    if (!success) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      })
    }

    const response = NextResponse.next()
    response.headers.set("X-RateLimit-Limit", limit.toString())
    response.headers.set("X-RateLimit-Remaining", remaining.toString())
    response.headers.set("X-RateLimit-Reset", reset.toString())
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/generate"],
}
