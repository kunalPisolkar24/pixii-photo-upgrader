import { ApiResponse } from "./types"

export class ApiResponseFactory {
  static success<T>(data: T, status: number = 200): ApiResponse<T> {
    return {
      data,
      status
    }
  }

  static error(message: string, status: number = 500): ApiResponse<never> {
    return {
      error: message,
      status
    }
  }
}
