import 'dotenv/config'
import express from 'express'
import type { ErrorRequestHandler } from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { toNodeHandler } from 'better-auth/node'
import { auth } from './auth.js'
import { doctorsRouter } from './routes/doctors.js'
import { appointmentsRouter } from './routes/appointments.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, '../dist')

const app = express()

// Better Auth needs the raw (un-parsed) request, so it must be mounted before express.json().
app.all('/api/auth/*splat', toNodeHandler(auth))

app.use(express.json())

app.use('/api/doctors', doctorsRouter)
app.use('/api/appointments', appointmentsRouter)

app.use(express.static(distDir))
app.get(/(.*)/, (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    next()
    return
  }
  res.sendFile(path.join(distDir, 'index.html'))
})

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
}
app.use(errorHandler)

const port = Number(process.env.PORT) || 3001
app.listen(port, () => {
  console.log(`API + static server listening on http://localhost:${port}`)
})
