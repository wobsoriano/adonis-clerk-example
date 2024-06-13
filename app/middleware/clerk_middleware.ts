import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { createClerkClient } from '@clerk/backend'
import { apiUrlFromPublishableKey } from '@clerk/shared/apiUrlFromPublishableKey'

const API_VERSION = process.env.CLERK_API_VERSION || 'v1'
const PUBLISHABLE_KEY = process.env.CLERK_PUBLISHABLE_KEY || ''
const API_URL = process.env.CLERK_API_URL || apiUrlFromPublishableKey(PUBLISHABLE_KEY)
const SECRET_KEY = process.env.CLERK_SECRET_KEY || ''
const JWT_KEY = process.env.CLERK_JWT_KEY || ''

const clerkClient = createClerkClient({
  publishableKey: PUBLISHABLE_KEY,
  secretKey: SECRET_KEY,
  apiUrl: API_URL,
  apiVersion: API_VERSION,
  jwtKey: JWT_KEY,
})

export default class ClerkMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const req = adonisRequestToRequest(ctx.request)
    const requestState = await clerkClient.authenticateRequest(req)

    requestState.headers.forEach((value, key) => {
      ctx.response.header(key, value)
    })

    // @ts-expect-error: Inject auth so the custom getter can read it
    ctx.request.__auth = requestState.toAuth()

    /**
     * Call next method in the pipeline and return its output
     */
    const output = await next()
    return output
  }
}

const adonisRequestToRequest = (req: HttpContext['request']): Request => {
  const headers = new Headers(
    Object.keys(req.headers()).reduce((acc, key) => {
      const value = req.headers()[key]
      if (!value) {
        return acc
      }

      if (typeof value === 'string') {
        acc.set(key, value)
      } else {
        acc.set(key, value.join(','))
      }
      return acc
    }, new Headers())
  )

  // Use a dummy base and the request will be fixed by the internals of the clerk/backend package
  const dummyOriginReqUrl = new URL(req.url() || '', `${req.protocol()}://clerk-dummy`)
  return new Request(dummyOriginReqUrl, { method: req.method(), headers })
}
