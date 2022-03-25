// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'

const fs = require('fs/promises')

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {id} = req.query
    try {
        const content = await fs.readFile(`./installer/${id}.json`, "utf-8")
        res.status(200).setHeader("Content-Type", "application/json").end(content);
    } catch (err: any) {
        if(err.code==='ENOENT')
            res.status(404).end();
        else
            res.status(500).json({text: err.message})
    }
}
