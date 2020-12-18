// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const faunadb = require('faunadb')
const { cors, runMiddleware } = require('../../cors')
const q = faunadb.query
const client = new faunadb.Client({
	secret: process.env.FAUNADB_KEY
})

export default async (req, res) => {
	await runMiddleware(req, res, cors)

	if (req.method === 'POST') {
		try {
			console.log('url-shorner-create: started')
			const { short_url, long_url } = await JSON.parse(req.body)

			const result0 = await client.query(
				q.Create(q.Collection(process.env.FAUNADB_COLLECTION), {
					data: { short_url, long_url }
				})
			)

			console.log('url-shornertner-create: successful\n', result0)
			res.status(201).end()
		} catch (err) {
			console.log('url-shortner-create: Error-occured\n', err)
			res.status(400).end()
		}
	} else if (req.method === 'GET') {
		try {
			console.log('url-shortner-get: started')
			const { short_url } = req.query

			const result0 = await client.query(q.Get(q.Match
				(q.Index(process.env.FAUNADB_INDEX), short_url)
			))

			console.log('url-shortner-get: successful\n', result0)
			res.status(200).end(JSON.stringify(result0.data))
		} catch (err) {
			console.log('url-shortner-get: Error-occured\n', err)
			res.status(400).end()
		}
	}
}
