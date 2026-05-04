import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { ratelimit } from "@/lib/services/rate-limiter.service"
import { isLocalEnvironment } from "@/lib/environment"
import { QuotaInfo } from "@/lib/types"
import { ApiResponseFactory } from "@/lib/api-response-factory"

export async function GET(request: NextRequest) {
  try {
    const forwarded = request.headers.get("x-forwarded-for")
    const ip = forwarded ? forwarded.split(",")[0] : (request.headers.get("x-real-ip") ?? "127.0.0.1")
    
    const isLocal = isLocalEnvironment(request.nextUrl.hostname)

    let quotaData: QuotaInfo

    if (isLocal) {
      quotaData = {
        limit: 3,
        remaining: 3,
        reset: 0,
      }
    } else {
      const { remaining, reset } = await ratelimit.getRemaining(ip)
      quotaData = {
        limit: 3,
        remaining,
        reset,
      }
    }

    return NextResponse.json(ApiResponseFactory.success(quotaData))
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch quota"
    return NextResponse.json(ApiResponseFactory.error(message, 500), { status: 500 })
  }
}
