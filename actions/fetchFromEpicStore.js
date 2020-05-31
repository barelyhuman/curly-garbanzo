import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';
import cheerio from 'cheerio';

export async function fetchFromEpicStore() {
  try {
    const source = 'https://www.epicgames.com';
    const url =
      'https://www.epicgames.com/store/en-US/browse?sortBy=releaseDate&sortDir=DESC&pageSize=10';

    const browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: 'networkidle2',
    });

    let bodyHTML = await page.evaluate(() => document.body.innerHTML);

    const gameCardSelector = '.BrowseGrid-card_9f6a50fb';
    const gamePriceSelector = '.PurchasePrice-priceContainer_f0baeac9 > span';
    const imageSelector = '.Picture-picture_6dd45462 > img';
    const nameSelector = '.OfferTitleInfo-title_abc02a91';

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

    await browser.close();
    return result;
  } catch (err) {
    throw err;
  }
}

export default fetchFromEpicStore;
