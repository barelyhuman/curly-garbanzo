const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const fetchFromEpicStore = require('./actions/fetchFromEpicStore');
const db = require('quick.db');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const PORT = process.env.PORT || 3000;

setInterval(() => {
  addToDb();
}, 900000);

addToDb();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);

    handle(req, res, parsedUrl);
  }).listen(PORT, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});

async function addToDb() {
  try {
    const data = await fetchFromEpicStore();
    db.set('epic', data);
  } catch (err) {
    console.error(err);
  }
}
