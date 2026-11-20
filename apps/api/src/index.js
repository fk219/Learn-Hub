import { env } from './config/env.js'
import { connectDb } from './config/db.js'
import { createApp } from './app.js'
import { ensureSingleAdmin } from './services/adminBootstrap.js'
import { seedCourses, seedDemoLearner } from './services/seedCourses.js'

await connectDb()
await ensureSingleAdmin()
await seedCourses()
await seedDemoLearner()

const app = createApp()
app.listen(env.PORT, () => {
  process.stdout.write(`API listening on ${env.PORT}\n`)
})

