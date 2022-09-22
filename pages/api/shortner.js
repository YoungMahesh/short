// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const faunadb = require("faunadb");
const { cors, runMiddleware } = require("../../cors");
const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_KEY,
});

export default async (req, res) => {
  await runMiddleware(req, res, cors); // with cors, api-endpoint is open for the public-use

  if (req.method === "POST") {
    try {
      // get short and long-url from the user
      console.log("url-shorner-create: started");
      const { short_url, long_url } = await JSON.parse(req.body);

      // add short and long-url to the faunadb-databae
      const result0 = await client.query(
        q.Create(q.Collection(process.env.FAUNADB_COLLECTION), {
          data: { short_url, long_url },
        })
      );

      // send success response
      console.log("url-shornertner-create: successful\n", result0);
      res.status(201).end();
    } catch (err) {
      // error occured while storing urls in database
      console.log("url-shortner-create: Error-occured\n", err);
      res.status(400).end();
    }
  } else if (req.method === "GET") {
    try {
      // get short_url from the request
      console.log("url-shortner-get: started");
      const { short_url } = req.query;

      // find short_url in database
      const result0 = await client.query(
        q.Get(q.Match(q.Index(process.env.FAUNADB_INDEX), short_url))
      ); // if short-url not found, client.query automatically cretes an error instead of creating 'result0-object'

      // send back long_url connected to the short_url in database
      console.log("url-shortner-get: successful\n", result0);
      res.status(200).end(JSON.stringify(result0.data));
    } catch (err) {
      // error occurred while finding short_url
      console.log("url-shortner-get: Error-occured\n", err);
      res.status(400).end();
    }
  }
};
