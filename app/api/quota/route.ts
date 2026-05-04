import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getRemainingQuota } from "@/lib/services/rate-limiter.service"
import { ApiResponseFactory } from "@/lib/api-response-factory"

export async function GET(request: NextRequest) {
  try {
    const forwarded = request.headers.get("x-forwarded-for")
    const ip = forwarded ? forwarded.split(",")[0] : (request.headers.get("x-real-ip") ?? "127.0.0.1")
    const quotaData = await getRemainingQuota(ip, request.nextUrl.hostname)

    return NextResponse.json(ApiResponseFactory.success(quotaData))
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch quota"
    return NextResponse.json(ApiResponseFactory.error(message, 500), { status: 500 })
  }
}
