import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { ratelimit } from "@/lib/services/rate-limiter.service"
import { isLocalEnvironment } from "@/lib/environment"
import { ApiResponse, QuotaInfo } from "@/lib/types"

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

    const response: ApiResponse<QuotaInfo> = {
      data: quotaData,
      status: 200
    }

    return NextResponse.json(response)
  } catch (error) {
    const response: ApiResponse<never> = {
      error: error instanceof Error ? error.message : "Failed to fetch quota",
      status: 500
    }
    return NextResponse.json(response, { status: 500 })
  }
}
