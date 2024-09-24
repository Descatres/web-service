const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", (_req, res) => {
    res.sendFile(__dirname + "../public/index.html");
});

router.get("/crypto", async (req, res) => {
    const { coin = "bitcoin", currency = "usd" } = req.query;

    try {
        const response = await axios.get(
            `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=${currency}`
        );
        const data = response.data;

        if (req.headers.accept.includes("application/json")) {
            return res.json(data);
        }

        const htmlResponse = `<h1>${coin.toUpperCase()} Price</h1>
                          <p>Price in ${currency.toUpperCase()}: ${
            data[coin][currency]
        }</p>`;
        res.send(htmlResponse);
    } catch (error) {
        res.status(500).send("Error fetching data");
    }
});

router.get("/filter", async (req, res) => {
    const { minPrice = 10000, currency = "usd" } = req.query;
    try {
        const response = await axios.get(
            `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano&vs_currencies=${currency}`
        );
        const data = response.data;

        const filteredCoins = Object.keys(data).filter(
            (coin) => data[coin][currency] > minPrice
        );
        if (req.headers.accept.includes("application/json")) {
            return res.json(filteredCoins);
        }
        let htmlContent = `<h1>Coins Above ${minPrice} ${currency.toUpperCase()}</h1><ul>`;
        filteredCoins.forEach((coin) => {
            htmlContent += `<li>${coin.toUpperCase()}: ${
                data[coin][currency]
            } ${currency.toUpperCase()}</li>`;
        });
        htmlContent += "</ul>";

        res.send(htmlContent);
    } catch (error) {
        res.status(500).send(
            "Error fetching or filtering data (or cd from the api provider)"
        );
    }
});

router.get("/compare", async (req, res) => {
    const {
        coin1 = "bitcoin",
        coin2 = "ethereum",
        currency = "usd",
    } = req.query;
    try {
        const response = await axios.get(
            `https://api.coingecko.com/api/v3/simple/price?ids=${coin1},${coin2}&vs_currencies=${currency}`
        );
        const data = response.data;

        const price1 = data[coin1][currency];
        const price2 = data[coin2][currency];
        const difference = Math.abs(price1 - price2);
        const percentageChange = ((difference / price1) * 100).toFixed(2);

        if (req.headers.accept.includes("application/json")) {
            return res.json({ price1, price2, difference, percentageChange });
        }

        const htmlContent = `
        <h1>Price Comparison: ${coin1.toUpperCase()} vs ${coin2.toUpperCase()}</h1>
        <p>${coin1.toUpperCase()}: ${price1} ${currency.toUpperCase()}</p>
        <p>${coin2.toUpperCase()}: ${price2} ${currency.toUpperCase()}</p>
        <p>Difference: ${difference} ${currency.toUpperCase()}</p>
        <p>Percentage Change: ${percentageChange}%</p>
      `;
        res.send(htmlContent);
    } catch (error) {
        res.status(500).send("Error fetching comparison data");
    }
});

module.exports = router;
