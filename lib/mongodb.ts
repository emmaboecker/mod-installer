import {MongoClient} from "mongodb"

let client: MongoClient
let clientPromise: Promise<MongoClient>

export default function mongoClientPromise() {
    if (!clientPromise) {
        const uri = process.env.MONGODB_URI

        if (!uri) {
            throw new Error("Please add your Mongo URI to your env variables")
        }

        client = new MongoClient(uri!!, {

        })
        clientPromise = client.connect()
    }
    return clientPromise
}
