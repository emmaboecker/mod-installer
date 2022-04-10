import type {NextApiRequest, NextApiResponse} from 'next'
import clientPromise from "../../../lib/mongodb";
import {User} from "next-auth";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<User>
) {
    const client = await clientPromise()
    const accountsCollection = client.db().collection("accounts")
    const { id } = req.query

    const account = await accountsCollection.findOne({providerAccountId: id})

    if (!account) {
        res.status(406).end()
        return
    }
    const userCollection = client.db().collection("users")
    const user = await userCollection.findOne({_id: account?.userId})
    if (!user) {
        res.status(500).end()
        return
    }

    res.json({
        id: account.providerAccountId,
        name: user.name,
        role: user.role,
        username: user.name,
        image: user.image
    })
}
