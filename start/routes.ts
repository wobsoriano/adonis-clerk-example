/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.on('/').render('pages/home')

router.get('/api/me', (ctx) => {
  const { userId } = ctx.request.auth

  if (!userId) {
    return ctx.response.status(401).send('Unauthorized')
  }

  return ctx.response.json(ctx.request.auth)
})
