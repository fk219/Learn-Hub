import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

let mongo

export async function connectTestDb() {
  mongo = await MongoMemoryServer.create()
  await mongoose.connect(mongo.getUri())
}

export async function disconnectTestDb() {
  await mongoose.disconnect()
  if (mongo) await mongo.stop()
}

export async function clearTestDb() {
  const collections = await mongoose.connection.db.collections()
  for (const c of collections) {
    await c.deleteMany({})
  }
}

