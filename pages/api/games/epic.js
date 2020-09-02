const db = require('quick.db');

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const data = db.get('epic');
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
