// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import ErrnoException = NodeJS.ErrnoException;

const fs = require('fs')

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const {id} = req.query

    fs.readFile(`./installer/${id}.json`, "utf-8", (err: ErrnoException | null, data: string) => {
        if (!err) {
            res.status(200).json(JSON.parse(data))
        } else {
            res.status(404).json({text: err.message})
        }
    })
}
