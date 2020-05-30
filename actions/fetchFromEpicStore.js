import puppeteer from "puppeteer";
import cheerio from "cheerio";
import axios from "axios";
import fs from "fs";
import mkdirp from "mkdirp";

export async function fetchFromEpicStore() {
    try {
        const filePath = "temp/results.json";
        mkdirp("temp");

        const source = "https://www.epicgames.com";
        const url =
            "https://www.epicgames.com/store/en-US/browse?sortBy=releaseDate&sortDir=DESC&pageSize=1000";

        if (fs.existsSync(filePath)) {
            const existingData = fs.readFileSync("temp/results.json");
            if (existingData) {
                const parsedValue = JSON.parse(existingData);
                if (
                    parsedValue &&
                    new Date(parsedValue.expiryTime).getTime() <
                        new Date().getTime()
                ) {
                    return existingData.records;
                }
            }
        }

        const browser = await puppeteer.launch({
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
            headless: true,
        });

        const page = await browser.newPage();
        await page.goto(url, {
            waitUntil: "networkidle0",
        });

        let bodyHTML = await page.evaluate(() => document.body.innerHTML);

        const gameCardSelector = ".BrowseGrid-card_9f6a50fb";
        const gamePriceSelector =
            ".PurchasePrice-priceContainer_f0baeac9 > span";
        const imageSelector = ".Picture-picture_6dd45462 > img";
        const nameSelector = ".OfferTitleInfo-title_abc02a91";
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

            if (
                nameContainer[0] &&
                nameContainer[0].children[0] &&
                nameContainer[0].children[0].data
            ) {
                itemDetails.name = nameContainer[0].children[0].data;
            }

            if (imageContainer[0] && imageContainer[0].attribs) {
                itemDetails.image =
                    imageContainer[0].attribs["data-image"] || null;
            }

            if (
                elem.children[0] &&
                elem.children[0].attribs &&
                elem.children[0].attribs.href
            ) {
                itemDetails.link = source + "" + elem.children[0].attribs.href;
            }

            if (priceContainer[0]) {
                itemDetails.price = priceContainer[0].children[0]
                    ? priceContainer[0].children[0].data
                    : null;

                if (itemDetails.price.toLowerCase().includes("free")) {
                    result.push(itemDetails);
                }
            }
        });

        const fileData = {
            expiryTime: new Date(
                new Date().setHours(new Date().getHours() + 1)
            ),
            records: result,
        };

        fs.writeFileSync("temp/results.json", JSON.stringify(fileData));

        await browser.close();
        return result;
    } catch (err) {
        console.error(err);
    }
}

export default fetchFromEpicStore;
