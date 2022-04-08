import type {NextApiRequest, NextApiResponse} from 'next'
import clientPromise from "../../../lib/mongodb";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { id } = req.query
    const client = await clientPromise
    const collection = await client.db().collection("profiles")

    const content = await collection.findOne({_id: id})
    if (content) {
        res.status(200).json(content);
    } else {
        res.status(406).end()
    }
}
