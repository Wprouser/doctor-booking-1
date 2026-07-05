import { betterAuth } from 'better-auth'
import { pool } from './db.js'

export const auth = betterAuth({
  database: pool,
  secret: process.env.BETTER_AUTH_SECRET,
  // BETTER_AUTH_URL is an explicit override; RENDER_EXTERNAL_URL is auto-injected by Render.
  baseURL: process.env.BETTER_AUTH_URL ?? process.env.RENDER_EXTERNAL_URL,
  emailAndPassword: {
    enabled: true,
  },
})
