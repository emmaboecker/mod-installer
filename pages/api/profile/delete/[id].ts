import type {NextApiRequest, NextApiResponse} from 'next'
import clientPromise from "../../../../lib/mongodb";
import {getSession} from "next-auth/react";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "DELETE") {
        res.status(405).send({message: "Only DELETE requests allowed"})
        return
    }

    const session = await getSession(res)

    if (!session) {
        res.status(401).end()
        return
    }

    const { id } = req.query

    const client = await clientPromise()
    const collection = await client.db().collection("profiles")

    const modList = await collection.findOne({_id: id})

    if (modList) {
        if (session.user.id !== modList.creator) {
            res.status(403).end()
            return
        }
        await collection.deleteOne({_id: id})
        res.status(200).end()
    } else {
        res.status(406).end()
    }
}
