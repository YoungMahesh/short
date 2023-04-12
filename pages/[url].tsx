import { useEffect, useState } from 'react'
import Head from 'next/head'

const UrlPage = ({ url }: { url: string }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [longUrl, setLongUrl] = useState('')
  const [baseUrl, setBaseUrl] = useState('')

  useEffect(() => {
    setBaseUrl(window.location.origin)
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        // fetch the longUrl connected to shortUrl from the backend-api
        const response0 = await fetch(`api/short?short_url=${url}`)

        // if shortUrl exists in database, then provide longUrl connected to it to the frontend else provide null
        if (response0.status === 200) {
          let { long_url } = await response0.json()
          if (!/^https?:\/\//i.test(long_url)) {
            long_url = 'http://' + long_url
          }
          window.location.href = long_url
          setLongUrl(long_url)
        }
      } catch (err) {
        console.log(err)
      }
      setIsLoading(false)
    })()
  }, [])

  return (
    <div>
      <Head>
        <title>in | URL Shortner</title>
        <link rel="icon" href="/link.png" />
      </Head>

      <main>
        {isLoading ? (
          <p>Loading...</p>
        ) : longUrl.length ? (
          <p>
            Redirecting to: &nbsp;
            <a href={longUrl} target="_blank" rel="noreferrer">
              {longUrl}
            </a>
          </p>
        ) : (
          <p>
            Short-URL: &quot;{baseUrl}/{url}&quot; is not in use,{' '}
            <a href={baseUrl}>click here to use this url</a>{' '}
          </p>
        )}
      </main>
    </div>
  )
}

export async function getServerSideProps(context: any) {
  // get short_url provided in params
  const { url } = context.params
  return {
    props: { url }, // will be passed to the page component as props
  }
}

export default UrlPage
