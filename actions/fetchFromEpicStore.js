import puppeteer from 'puppeteer';
import cheerio from 'cheerio';
import shelljs from 'shelljs';

export async function fetchFromEpicStore() {
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

    await page.goto(url, {
      waitUntil: 'networkidle0',
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

export default fetchFromEpicStore;
