import Head from "next/head";
import useSWR from "swr";

export default function Home() {
  const { data, error } = useSWR("/api/games/epic", async (...args) => {
    const res = await fetch(...args);
    return res.json();
  });

  console.log({ data });

  return (
    <div className="container">
      <div className="grid">
        {!data ? (
          <div>
            Loading....
            <p>
              <small>
                Can take a while, since we get the latest data from epic store
              </small>
            </p>
          </div>
        ) : (
          data.map((item) => {
            return (
              <div className="card" key={item.id}>
                <div>
                  <img className="card-img" src={item.image} alt="" />
                  <p>{item.name}</p>
                  <p>{item.price}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
      <style jsx>{`
        * {
          box-sizing: border-box;
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
          border: 1px solid rgba(12, 12, 13, 0.1);
          box-shadow: 0 1px 2px rgba(12, 12, 13, 0.1);
          margin: 8px;
        }

        .card .card-img {
          width: 100%;
          object-fit: contain;
        }
      `}</style>
    </div>
  );
}
