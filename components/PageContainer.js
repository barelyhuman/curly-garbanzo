import Head from 'next/head';
export default function PageContainer(props) {
  return (
    <>
      <Head>
        <title>Free Games | Scraper for Online Game Stores</title>
      </Head>
      <div className="container">{props.children}</div>
      <style jsx global>
        {`
          @font-face {
            font-family: Inter;
            font-weight: 100 900;
            font-display: block;
            src: url(https://assets.vercel.com/raw/upload/v1587415301/fonts/2/inter-var-latin.woff2)
              format('woff2');
          }
          :root {
            --gap-quarter: 0.25rem;
            --gap-half: 0.5rem;
            --gap: 1rem;
            --gap-double: 2rem;
            --bg: #fff;
            --fg: #000;
            --accents-1: #111;
            --accents-2: #333;
            --accents-3: #888;
            --geist-foreground: #000;
            --radius: 8px;
            --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
              'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',
              'Droid Sans', 'Helvetica Neue', sans-serif;
            --font-mono: Menlo, Monaco, Lucida Console, Liberation Mono,
              DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
          }
          * {
            box-sizing: border-box;
          }
          body,
          html {
            padding: 0;
            margin: 0;
            font-size: 20px;
          }
          body {
            min-height: 100vh;
            background: var(--bg);
            color: var(--fg);
            font-family: var(--font-sans);
            display: flex;
            flex-direction: column;
            align-items: center;
            background-image: radial-gradient(#ddd 1px, transparent 0),
              radial-gradient(#ddd 1px, transparent 0);
            background-position: 0 0, 25px 25px;
            background-attachment: fixed;
            background-size: 50px 50px;
            overflow-x: hidden;
          }
          body:not(.animate) .slice:after {
            content: unset;
          }
          body.animate .slice {
            -webkit-animation: fadeIn 1.8s ease-in-out forwards;
            animation: fadeIn 1.8s ease-in-out forwards;
          }
          body.animate .slice:after {
            -webkit-animation: slideRight 1.5s
              cubic-bezier(0.645, 0.045, 0.355, 1) forwards;
            animation: slideRight 1.5s cubic-bezier(0.645, 0.045, 0.355, 1)
              forwards;
            -webkit-animation-delay: 0.8s;
            animation-delay: 0.8s;
          }
          body.animate .features {
            opacity: 0;
            -webkit-animation: fadeIn 0.5s ease-in-out forwards;
            animation: fadeIn 0.5s ease-in-out forwards;
            -webkit-animation-delay: 2s;
            animation-delay: 2s;
          }
          body.animate .fadeIn {
            opacity: 0;
            -webkit-animation: fadeIn 0.5s ease-in-out forwards;
            animation: fadeIn 0.5s ease-in-out forwards;
            -webkit-animation-delay: 2.5s;
            animation-delay: 2.5s;
          }
          body.animate .links {
            opacity: 0;
            -webkit-animation: fadeIn 0.5s ease-in-out forwards;
            animation: fadeIn 0.5s ease-in-out forwards;
            -webkit-animation-delay: 2s;
            animation-delay: 2s;
          }
          body.animate h1 .slice:after {
            width: 105%;
            left: -1%;
            -webkit-animation-delay: 0.5s;
            animation-delay: 0.5s;
            -webkit-animation-duration: 0.5s;
            animation-duration: 0.5s;
          }
          @-webkit-keyframes fadeIn {
            0% {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          @keyframes fadeIn {
            0% {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          @-webkit-keyframes slideRight {
            0% {
              width: 120%;
              left: 0;
              background-image: none;
            }
            to {
              width: 0;
              left: 120%;
              opacity: 0.6;
            }
          }
          @keyframes slideRight {
            0% {
              width: 120%;
              left: 0;
              background-image: none;
            }
            to {
              width: 0;
              left: 120%;
              opacity: 0.6;
            }
          }
        `}
      </style>
    </>
  );
}
