const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const shelljs = require('shelljs');

async function fetchFromEpicStore() {
  let browser;
  try {
    const source = 'https://www.epicgames.com';
    const url =
      'https://www.epicgames.com/store/en-US/browse?sortBy=releaseDate&sortDir=DESC&pageSize=1000';

    browser = await puppeteer.launch({
      args: [
        '--disable-gpu',
        '--no-sandbox',
        '--single-process',
        '--disable-web-security',
        '--no-zygote',
      ],
      headless: true,
      ignoreHTTPSErrors: true,
    });

    const processId = browser.process().pid;

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);

    await page.goto(url, {
      waitUntil: 'networkidle0',
    });

    let bodyHTML = await page.evaluate(() => document.body.innerHTML);

    const gameCardSelector = '.css-1adx3p4-BrowseGrid-styles__card';
    const gamePriceSelector =
      '.css-r6gfjb-PurchasePrice__priceContainer > span';
    const imageSelector = '.css-10ldwzp-Picture-styles__picture > img';
    const nameSelector = '.css-tybchz-OfferTitleInfo__title';

    const $ = cheerio.load(bodyHTML);

    await page.waitForSelector(gamePriceSelector);

    const result = [];
    $(gameCardSelector).each((i, elem) => {
      const itemDetails = {
        id: i,
        name: null,
        image: null,
        link: null,
        price: null,
      };

      const priceContainer = $(gamePriceSelector, elem);
      const imageContainer = $(imageSelector, elem);
      const nameContainer = $(nameSelector, elem);

      itemDetails.name =
        nameContainer[0] &&
        nameContainer[0].children[0] &&
        nameContainer[0].children[0].data;

      itemDetails.image =
        imageContainer[0] && imageContainer[0].attribs['data-image'];

      itemDetails.link =
        source +
        '' +
        (elem &&
          elem.children[0] &&
          elem.children[0].attribs &&
          elem.children[0].attribs.href);

      itemDetails.price =
        priceContainer[0] && priceContainer[0].children[0]
          ? priceContainer[0].children[0].data
          : null;

      if (
        itemDetails.price &&
        itemDetails.price.toLowerCase().includes('free')
      ) {
        result.push(itemDetails);
      }
    });
    await page.close();
    await browser.close();
    shelljs.exec('pkill chrome');
    return result;
  } catch (err) {
    if (browser) {
      await browser.close();
    }
    throw err;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = fetchFromEpicStore;
