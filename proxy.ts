import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { checkRateLimit } from "./lib/services/rate-limiter.service"
import { ApiResponseFactory } from "./lib/api-response-factory"

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/generate") && request.method === "POST") {
    const forwarded = request.headers.get("x-forwarded-for")
    const ip = forwarded ? forwarded.split(",")[0] : (request.headers.get("x-real-ip") ?? "127.0.0.1")
    const hostname = request.nextUrl.hostname
    
    const { success, limit, remaining, reset, pending } = await checkRateLimit(ip, hostname)
    await pending

    if (!success) {
      return NextResponse.json(
        ApiResponseFactory.error("Rate limit exceeded", 429),
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        }
      )
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
