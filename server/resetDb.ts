import { MongoClient } from 'mongodb'

// Connection URL
const url = 'mongodb://127.0.0.1:27017'
const client = new MongoClient(url)

async function main() {
  await client.connect()
  console.log('Connected successfully to MongoDB')

  const db = client.db("test")

  // add data
  console.log("deleting customers", await db.collection("customers").deleteMany({}))
  console.log("deleting operators", await db.collection("operators").deleteMany({}))
  console.log("deleting ingredients", await db.collection("possibleIngredients").deleteMany({}))
  console.log("deleting orders", await db.collection("orders").deleteMany({}))

  process.exit(0)
}

main()
