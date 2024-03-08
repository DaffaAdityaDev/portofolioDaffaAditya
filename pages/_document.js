import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html className='scroll-smooth"'>
      <Head>
        {/* <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        /> */}
        {/* <title>Daffa Aditya Rahman</title>
        <meta name="description" content="Daffa Aditya Personal Website" />
        <meta property="og:title" content="Daffa Aditya Rahman" />
        <meta
          property="og:description"
          content="Daffa Aditya Personal Website"
        />
        <meta property="og:image" content="/image/Profile.jpg" />
        <meta property="og:url" content="https://daffaaditya.netlify.app" /> */}
        {/* <link rel="icon" href="/svg/selflogo.svg" /> */}
      </Head>

      <body className="h-screen dark:bg-slate-900 ">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
