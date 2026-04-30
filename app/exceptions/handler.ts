import app from '@adonisjs/core/services/app'
import { type HttpContext, ExceptionHandler } from '@adonisjs/core/http'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: unknown, ctx: HttpContext) {
    const err = error as any
    const status = typeof err?.status === 'number' ? err.status : 500
    const message =
      typeof err?.message === 'string' && err.message.length > 0
        ? err.message
        : 'Unexpected server error'
    const code = typeof err?.code === 'string' && err.code.length > 0 ? err.code : 'INTERNAL_ERROR'

    if (status >= 500 && this.debug) {
      return super.handle(error, ctx)
    }

    return ctx.response.status(status).json({
      status,
      code,
      message,
    })
  }

  /**
   * The method is used to report error to the logging service or
   * the a third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
