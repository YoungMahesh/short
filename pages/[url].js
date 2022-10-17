import { useEffect } from "react";
import Head from "next/head";

const UrlPage = ({ longUrl, baseUrl, url }) => {
  // if longUrl is null, then provided shortUrl is not in use
  if (longUrl === null) {
    return (
      <p>
        Short-URL: "{baseUrl}/{url}" is not in use,{" "}
        <a href={baseUrl}>click here to use this url</a>{" "}
      </p>
    );
  }

  // else redirect current-page to the longUrl
  useEffect(() => {
    window.location.href = longUrl;
  });

  // show redirecting-message to the user until longUrl-page "loading..." ends
  return (
    <div>
      <Head>
        <title>in | URL Shortner</title>
        <link rel="icon" href="/link.png" />
      </Head>

      <main>
        <p>
          Redirecting to:{" "}
          <a href={longUrl} target="_blank">
            {longUrl}
          </a>
        </p>
      </main>
    </div>
  );
};

export async function getServerSideProps(context) {
  // baseUrl is necessary for fetching data
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://in.now.sh";

  // get short_url provided in params
  const { url } = context.params;

  // fetch the longUrl connected to shortUrl from the backend-api
  let longUrl = null;
  const response0 = await fetch(`${baseUrl}/api/short?short_url=${url}`);

  // if shortUrl exists in database, then provide longUrl connected to it to the frontend else provide null
  if (response0.status === 200) {
    const { long_url } = await response0.json();
    longUrl = long_url;
  }
  return {
    props: { longUrl, baseUrl, url }, // will be passed to the page component as props
  };
}

export default UrlPage;
