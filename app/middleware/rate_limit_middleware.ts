import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

type CounterWindow = {
  count: number
  resetAt: number
}

const WINDOW_MS = 60_000
const MAX_REQUESTS_PER_WINDOW = 30
const counters = new Map<string, CounterWindow>()

export default class RateLimitMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const isLocationWrite =
      ctx.request.method() === 'POST' && ctx.request.url().startsWith('/api/v1/locations')

    if (!isLocationWrite) {
      return next()
    }

    const identifier =
      ctx.request.header('x-forwarded-for')?.split(',')[0].trim() || ctx.request.ip() || 'unknown'
    const currentTime = Date.now()
    const currentWindow = counters.get(identifier)

    if (!currentWindow || currentWindow.resetAt <= currentTime) {
      counters.set(identifier, { count: 1, resetAt: currentTime + WINDOW_MS })
      return next()
    }

    if (currentWindow.count >= MAX_REQUESTS_PER_WINDOW) {
      return ctx.response.status(429).json({
        status: 429,
        code: 'RATE_LIMITED',
        message: 'Too many location write requests. Please retry later.',
      })
    }

    currentWindow.count += 1
    return next()
  }
}
