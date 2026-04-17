import express from 'express'
import { jobsRouter } from './routes/jobs.js'
import { corsMiddleware } from './middlewares/cors.js'
import { DEFAULTS } from './config.js'
import { aiRouter } from './routes/ai.js'
import { ai2Router } from './routes/ai2.js'

const PORT = process.env.PORT ?? DEFAULTS.PORT
const app = express()

app.set('trust proxy', 1)

app.use(corsMiddleware())
app.use(express.json())

app.use('/jobs', jobsRouter)
app.use('/ai', aiRouter)
app.use('/ai2', ai2Router)

if (!process.env.NODE_ENV) {
  app.listen(PORT, () => {
    console.log(`Servidor levantado en http://localhost:${PORT}`)
  })
}

export default app

