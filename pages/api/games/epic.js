import { fetchFromEpicStore } from 'actions/fetchFromEpicStore';

export default async (req, res) => {
  const timeStart = Date.now();
  try {
    if (req.method === 'GET') {
      const data = await fetchFromEpicStore();
      const timeEnd = Date.now();
      console.log(timeEnd - timeStart);
      return res.status(200).send(data || []);
    }
    return res.send(404).end();
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({ error: 'Oops! Something went wrong!', message: String(err) });
  }
};
