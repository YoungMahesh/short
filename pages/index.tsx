import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const [shortUrl, updateShortUrl] = useState('')
  let [longUrl, updateLongUrl] = useState('')

  const [message0, updateMessage0] = useState('')
  const [link0, updateLink0] = useState('')

  const setShortUrl = async (e) => {
    e.preventDefault()
    updateMessage0('Creating...')
    updateLink0('')
    if (!longUrl.includes('.')) {
      return updateMessage0('URL is not valid')
    }

    if (
      longUrl.substring(0, 7) !== 'http://' &&
      longUrl.substring(0, 8) !== 'https://'
    ) {
      longUrl = 'http://' + longUrl
    }
    const dataObj = { short_url: shortUrl, long_url: longUrl }
    const response0 = await fetch(`/api/short`, {
      method: 'POST',
      body: JSON.stringify(dataObj),
    })
    if (response0.status === 400) {
      return updateMessage0('Short-URL is already in use, try another')
    }

    updateMessage0('')
    updateLink0(`${process.env.BASE_URL}/${shortUrl}`)
  }

  const copyShortUrl = () => {
    navigator.clipboard.writeText(`${process.env.BASE_URL}/${shortUrl}`)
    alert(`Copied Short-URL: ${process.env.BASE_URL}/${shortUrl}`)
  }

  return (
    <div>
      <Head>
        <title>in | URL Shortner</title>
        <link rel="icon" href="/link.png" />
      </Head>

      <header>
        <h3>URL Shortner</h3>
        <h4>
          <a href="https://github.com/YoungMahesh/in" target="_blank">
            | View Source
          </a>
        </h4>
      </header>

      <main>
        <form>
          <label>
            Long URL:
            <input
              type="text"
              value={longUrl}
              onChange={(e) => updateLongUrl(e.target.value)}
            />
          </label>

          <label>
            Short URL:
            <input
              type="text"
              value={shortUrl}
              onChange={(e) => updateShortUrl(e.target.value)}
            />
            <p>
              Shortned-URL: {process.env.BASE_URL}/{shortUrl}
            </p>
            <p style={{ color: '#ff8906' }}>
              To shorten Youtube-url --&gt; to official-youtube-short-url:{' '}
              <Link href="/yt">
                <a style={{ color: 'inherit' }}>Click here</a>
              </Link>
            </p>
          </label>

          <button className="create-btn" onClick={(e) => setShortUrl(e)}>
            Create
          </button>
        </form>
        <p>{message0}</p>

        <div
          className="creation-result"
          style={link0.length > 0 ? {} : { display: 'none' }}
        >
          <p>
            Short URL: "{link0}" created successfully.
            <button onClick={copyShortUrl}>Copy Short-URL</button>
          </p>
        </div>
      </main>
    </div>
  )
}
