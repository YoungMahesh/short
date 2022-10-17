import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.method === "POST") {
        try {
            const { short_url, long_url } = await JSON.parse(req.body);
            console.log({ short_url, long_url })
            await prisma.urls.create({ data: { short_url, long_url } })
            res.status(201).end();
        } catch (err) {
            console.log(err);
            res.status(400).end();
        }
    } else if (req.method === "GET") {
        try {
            const { short_url }: any = req.query;
            const data = await prisma.urls.findUnique({
                where: {
                    short_url,
                },
            })
            
            if(data === null) throw new Error('short_url does not exist')
            res.status(200).send(data);
        } catch (err) {
            console.log(err);
            res.status(400).end();
        }
    }
}
