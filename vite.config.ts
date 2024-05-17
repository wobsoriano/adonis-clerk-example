import { defineConfig } from 'vite'
import adonisjs from '@adonisjs/vite/client'
import EnvironmentPlugin from 'vite-plugin-environment'

export default defineConfig({
  plugins: [
    EnvironmentPlugin(['CLERK_PUBLISHABLE_KEY']),
    adonisjs({
      /**
       * Entrypoints of your application. Each entrypoint will
       * result in a separate bundle.
       */
      entrypoints: ['resources/css/app.css', 'resources/js/app.js'],

      /**
       * Paths to watch and reload the browser on file change
       */
      reload: ['resources/views/**/*.edge'],
    }),
  ],
})
