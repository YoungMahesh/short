import Head from 'next/head'
import { useState } from 'react'

export default function Youtube() {
  const [shortUrl, updateShortUrl] = useState('')
  let [longUrl, updateLongUrl] = useState('')

  const [message0, updateMessage0] = useState('')

  const isAlreadyShort = (url: string) => {
    const regex = /^youtu.be\/\w{8,13}/
    return regex.test(url)
  }

  const isValidYoutubeUrl = (url: string) => {
    const regex =
      /^https:\/\/(www\.youtube\.com\/watch\?v=|youtu.be\/)\w{8,13}$/ // I found - every time \w{11} in long-urls
    return regex.test(url)
  }

  const createShortUrl = () => {
    updateMessage0('')

    if (isAlreadyShort(longUrl)) {
      updateMessage0(`"${longUrl}" is already a shortned url`)
    } else if (isValidYoutubeUrl(longUrl)) {
      const original = /^https:\/\/(www\.youtube\.com\/watch\?v=|youtu.be\/)/ // https://www.youtube.com/watch?v= or https://youtu.be/
      const replaceWith = 'youtu.be/'
      const newUrl = longUrl.replace(original, replaceWith)
      updateShortUrl(newUrl)
    } else {
      updateMessage0('This is not valid youtube url')
    }
  }

  const copyShortUrl = () => {
    navigator.clipboard.writeText(shortUrl)
    alert(`Copied Short-URL: ${shortUrl}`)
  }

  return (
    <div>
      <Head>
        <title>Youtube | URL Shortner</title>
        <link rel="icon" href="/link.png" />
      </Head>

      <header>
        <h3>Youtube URL shortner</h3>
        <h4>
          <a
            href="https://github.com/YoungMahesh/in"
            target="_blank"
            rel="noreferrer"
          >
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

          <button className="create-btn" type="button" onClick={createShortUrl}>
            Create
          </button>
        </form>
        <p>{message0}</p>

        <div
          className="creation-result"
          style={shortUrl.length > 0 ? {} : { display: 'none' }}
        >
          <p>
            Youtube Short-URL:{' '}
            <span style={{ marginLeft: '7px' }}>{shortUrl}</span>
            <button onClick={copyShortUrl}>Copy Short-URL</button>
          </p>
        </div>
      </main>
    </div>
  )
}
