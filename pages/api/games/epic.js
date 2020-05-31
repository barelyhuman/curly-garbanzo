import { fetchFromEpicStore } from "actions/fetchFromEpicStore";

export default async (req, res) => {
  try {
    if (req.method === "GET") {
      const data = await fetchFromEpicStore();
      return res.status(200).send(data || []);
    }
    return res.send(404).end();
  } catch (err) {
    return res.status(500).send({ error: "Oops! Something went wrong!" });
  }
};
