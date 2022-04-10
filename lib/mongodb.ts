import {MongoClient} from "mongodb"

const uri = process.env.MONGODB_URI

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (!process.env.MONGODB_URI) {
    console.log("Please add your Mongo URI to your env variables")
}

client = new MongoClient(uri!!, {

})
clientPromise = client.connect()

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise
