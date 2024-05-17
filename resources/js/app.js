import { Clerk } from '@clerk/clerk-js'

const clerk = new Clerk(process.env.CLERK_PUBLISHABLE_KEY)

clerk
  .load({
    // Set load options here
  })
  .then(() => {
    if (clerk.user) {
      document.getElementById('app').innerHTML = `
      <div id="user-button"></div>
    `

      const userButtonDiv = document.getElementById('user-button')

      clerk.mountUserButton(userButtonDiv)
    } else {
      document.getElementById('app').innerHTML = `
      <div id="sign-in"></div>
    `

      const signInDiv = document.getElementById('sign-in')

      clerk.mountSignIn(signInDiv)
    }
  })
