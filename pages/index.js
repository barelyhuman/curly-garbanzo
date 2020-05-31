import Head from "next/head";
import useSWR from "swr";

export default function Home() {
  const { data, error } = useSWR("/api/games/epic", async (...args) => {
    const res = await fetch(...args);
    return res.json();
  });

  console.log({ error });

  if (error) {
    return <React.Fragment></React.Fragment>;
  }

  if (!data) {
    return (
      <div>
        Loading....
        <p>
          <small>
            Can take a while, since we get the latest data from epic store
          </small>
        </p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="grid">
        {data.map((item) => {
          return (
            <a href={item.link} className="nullify-link">
              <div className="card" key={item.id}>
                <div>
                  {
                    item.image?<img className="card-img" src={item.image} alt="" />:<div className="skeleton"></div>
                  }
                  <p>{item.name}</p>
                  <p>{item.price}</p>
                </div>
              </div>
            </a>
          );
        })}
      </div>
      <style jsx>{`
        * {
          font-family:sans-serif;
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
          min-height:400px;
          border: 1px solid rgba(12, 12, 13, 0.1);
          box-shadow: 0 1px 2px rgba(12, 12, 13, 0.1);
          margin: 8px;
        }

        .card .card-img {
          width: 100%;
          object-fit: contain;
        }

        .nullify-link{
          text-decoration:none;
          color:#666;
        }

        .nullify-link:hover{
          color:#000
        }

        .skeleton {
          width:100%;
          background:#eaeaea;
          height:248px;
        }

      `}</style>
    </div>
  );
}
