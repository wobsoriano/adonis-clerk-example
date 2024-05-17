import { Request } from '@adonisjs/core/http'
import { SignedInAuthObject, SignedOutAuthObject } from '@clerk/backend/internal'

Request.getter('auth', function (this: Request) {
  // @ts-expect-error: Manually attached from middleware
  return this.__auth
})

declare module '@adonisjs/core/http' {
  interface Request {
    auth: SignedInAuthObject | SignedOutAuthObject
  }
}
