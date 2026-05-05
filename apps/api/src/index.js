import { env } from './config/env.js'
import { connectDb } from './config/db.js'
import { createApp } from './app.js'
import { ensureSingleAdmin } from './services/adminBootstrap.js'

await connectDb()
await ensureSingleAdmin()

const app = createApp()
app.listen(env.PORT, () => {
  process.stdout.write(`API listening on ${env.PORT}\n`)
})

