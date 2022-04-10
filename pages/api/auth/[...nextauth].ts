import NextAuth from "next-auth"
import DiscordProvider from "next-auth/providers/discord";
import {MongoDBAdapter} from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";
import {Role} from "../../../types/role";
import {ObjectId} from "bson";

export default NextAuth({
    adapter: MongoDBAdapter(clientPromise()),
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID,
            clientSecret: process.env.DISCORD_CLIENT_SECRET
        })
    ],
    callbacks: {
        async session({session, user}) {
            const client = await clientPromise()
            const userCollection = client.db().collection("users")
            const accountCollection = client.db().collection("accounts")
            const userDoc = await userCollection.findOne({_id: new ObjectId(user.id)}) ?? {role: Role.DEFAULT}
            const accountDoc = await accountCollection.findOne({userId: new ObjectId(user.id)})
            session.user.id = accountDoc?.providerAccountId
            session.user.username = user.name as string
            session.user.image = user.image as string
            session.user.role = userDoc.role
            return session
        }
    },
    events: {
        async createUser({user}) {
            const client = await clientPromise()
            const collection = client.db().collection("users")

            collection.updateOne(
                {_id: new ObjectId(user.id)},
                {
                    $set: {
                        role: Role.DEFAULT
                    }
                }
            ).then(async (r) => {
                if (r.modifiedCount === 0 || r.modifiedCount > 1) {
                    console.error("failed to create role value")
                }
            }).catch(reason => {
                console.log(`error while creating role value: ${reason}`)
            });
        }
    }
})
