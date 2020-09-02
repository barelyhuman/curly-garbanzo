import useSWR from 'swr';
import { start, done } from 'components/nprogress';
import PageContainer from 'components/PageContainer';
import ifWindow from 'lib/if-window';

export default function Home() {
  const { data, error } = useSWR('/api/games/epic', async (...args) => {
    const res = await fetch(...args);
    return res.json();
  });

  if (error) {
    ifWindow() ? done() : null;
    return <div>failed to load</div>;
  }
  if (!data) {
    ifWindow() ? start() : null;
    return <div></div>;
  }

  ifWindow() ? done() : null;

  return (
    <PageContainer>
      <div className="container">
        <h1>Free Games | Scraper for Online Game Stores</h1>
        <p>
          This App is a toy project for scraping games that are available for
          free accross online gaming stores like Steam, Epic Store etc.
        </p>
        <p>
          <strong>Note:</strong> The Server scrapes every 15 minutes so if you
          don't see any data , the server's are probably updating data
        </p>
        <p>
          <strong>Currently Scraping:</strong> Epic Store
        </p>
        <div className="grid">
          {data.map((item) => {
            return (
              <a href={item.link} key={item.id} className="nullify-link">
                <div className="card">
                  <div>
                    {item.image ? (
                      <img className="card-img" src={item.image} alt="" />
                    ) : (
                      <div className="skeleton"></div>
                    )}
                    <p>{item.name}</p>
                    <p>{item.price}</p>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
      <style jsx>{`
        * {
          font-family: sans-serif;
          box-sizing: border-box;
        }

        body {
          background: #fff;
        }

        .container {
          max-width: 1040px;
          min-height: 100vh;
          margin: 0 auto;
        }

        .grid {
          display: flex;
          flex-wrap: wrap;
          padding: 8px;
        }

        .card {
          border-radius: 4px;
          padding: 16px;
          width: 220px;
          min-height: 400px;
          border: 1px solid rgba(12, 12, 13, 0.1);
          box-shadow: 0 1px 2px rgba(12, 12, 13, 0.1);
          margin: 8px;
          background: #fff;
        }

        .card .card-img {
          width: 100%;
          object-fit: contain;
        }

        .nullify-link {
          text-decoration: none;
          color: #666;
        }

        .nullify-link:hover {
          color: #000;
        }

        .skeleton {
          width: 100%;
          background: #eaeaea;
          height: 248px;
        }
      `}</style>
    </PageContainer>
  );
}
