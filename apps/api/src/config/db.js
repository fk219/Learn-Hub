import mongoose from 'mongoose'
import { env } from './env.js'

export async function connectDb() {
  if (env.MONGODB_URI) {
    await mongoose.connect(env.MONGODB_URI)
    return
  }

  if (env.NODE_ENV === 'production') {
    throw new Error('Missing MONGODB_URI')
  }

  const { MongoMemoryServer } = await import('mongodb-memory-server')
  const mongo = await MongoMemoryServer.create()
  await mongoose.connect(mongo.getUri())
}
