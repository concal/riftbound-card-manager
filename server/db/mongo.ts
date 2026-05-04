import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI
if (!uri) throw new Error("MONGODB_URI is not set")

export const client = new MongoClient(uri)

let connected = false

export async function getDb() {
  if (!connected) {
    await client.connect()
    connected = true
  }
  return client.db()
}
