const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", (_req, res) => {
    res.sendFile(__dirname + "../public/index.html");
});

router.get("/crypto", async (req, res) => {
    const {
        coin = "bitcoin,ethereum,cardano,binancecoin,tether,solana,xrp,dogecoin,polkadot,litecoin,chainlink,stellar,vechain,uniswap,aave,cosmos,tron,algorand,theta,tezos",
        currency = "usd",
    } = req.query;

    try {
        const response = await axios.get(
            `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=${currency}`
        );
        const data = response.data;

        const sortedCoins = Object.keys(data).sort(
            (a, b) => data[b][currency] - data[a][currency]
        );

        if (req.headers.accept.includes("application/json")) {
            return res.json(sortedCoins);
        }

        let htmlResponse = `<h1>Cryptocurrency Prices (Ordered by Price)</h1><ul>`;
        sortedCoins.forEach((coinName) => {
            htmlResponse += `<li>${coinName.toUpperCase()}: ${
                data[coinName][currency]
            } ${currency.toUpperCase()}</li>`;
        });
        htmlResponse += `</ul>`;

        res.send(htmlResponse);
    } catch (error) {
        res.status(500).send("Error fetching data");
    }
});

router.get("/filter", async (req, res) => {
    const {
        coin = "bitcoin,ethereum,cardano,binancecoin,tether,solana,xrp,dogecoin,polkadot,litecoin,chainlink,stellar,vechain,uniswap,aave,cosmos,tron,algorand,theta,tezos",
        minPrice = 0,
        currency = "usd",
    } = req.query;

    try {
        const response = await axios.get(
            `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=${currency}`
        );
        const data = response.data;

        const filteredCoins = Object.keys(data).filter(
            (coin) => data[coin][currency] >= minPrice
        );

        if (req.headers.accept.includes("application/json")) {
            return res.json(filteredCoins);
        }

        let text =
            minPrice > 0
                ? `Coins with price greater than ${minPrice}`
                : "No filter applied - Showing all available coins";

        let htmlContent = `<h1>Cryptocurrencies</h1>
        <h2>${text}</h2>
        <p>Filter Cryptocurrencies:</p>
        <label for="min-price">Min Price:</label>
        <input type="number" id="min-price" value="${minPrice}" />
        <button id="apply-filter">Apply Filter</button>
        <ul>`;
        filteredCoins.forEach((coin) => {
            htmlContent += `<li>${coin.toUpperCase()}: ${
                data[coin][currency]
            } ${currency.toUpperCase()}</li>`;
        });
        htmlContent += "</ul>";
        htmlContent += `<script>
            document.getElementById("apply-filter").onclick = function () {
                const minPrice = document.getElementById("min-price").value || 0;
                const selectedCurrency = "${currency}"; // Use currency from current query
                window.location.href = \`/filter?minPrice=\${minPrice}&currency=\${selectedCurrency}\`;
            };
        </script>`;
        res.send(htmlContent);
    } catch (error) {
        res.status(500).send("Error fetching or filtering data");
    }
});

router.get("/compare", async (req, res) => {
    const {
        coin1 = "bitcoin",
        coin2 = "ethereum",
        currency = "usd",
    } = req.query;

    const coinList = [
        "bitcoin",
        "ethereum",
        "cardano",
        "binancecoin",
        "tether",
        "solana",
        "xrp",
        "dogecoin",
        "polkadot",
        "litecoin",
        "chainlink",
        "stellar",
        "vechain",
        "uniswap",
        "aave",
        "cosmos",
        "tron",
        "algorand",
        "theta",
        "tezos",
    ];
    try {
        const response = await axios.get(
            `https://api.coingecko.com/api/v3/simple/price?ids=${coin1},${coin2}&vs_currencies=${currency}`
        );
        const data = response.data;

        const price1 = data[coin1][currency];
        const price2 = data[coin2][currency];
        const difference = Math.abs(price1 - price2);

        if (req.headers.accept.includes("application/json")) {
            return res.json({ price1, price2, difference });
        }

        const htmlContent = `
        <h1>Price Comparison</h1>
        <h2>Select Cryptocurrencies to Compare:</h2>
        <form id="compare-form">
          <label for="coin1">First Cryptocurrency:</label>
          <select id="coin1">
            ${coinList
                .map(
                    (coin) =>
                        `<option value="${coin}" ${
                            coin === coin1 ? "selected" : ""
                        }>${coin.toUpperCase()}</option>`
                )
                .join("")}
          </select>
          <label for="coin2">Second Cryptocurrency:</label>
          <select id="coin2">
            ${coinList
                .map(
                    (coin) =>
                        `<option value="${coin}" ${
                            coin === coin2 ? "selected" : ""
                        }>${coin.toUpperCase()}</option>`
                )
                .join("")}
          </select>
          <button type="button" id="compare-button">Compare</button>
        </form>
        <h2>Comparison between: ${coin1.toUpperCase()} & ${coin2.toUpperCase()}</h2>
        <p>${coin1.toUpperCase()}: ${price1} ${currency.toUpperCase()}</p>
        <p>${coin2.toUpperCase()}: ${price2} ${currency.toUpperCase()}</p>
        <p>Difference: ${difference} ${currency.toUpperCase()}</p>
        <script>
            document.getElementById("compare-button").onclick = function () {
                const selectedCoin1 = document.getElementById("coin1").value || "bitcoin";
                const selectedCoin2 = document.getElementById("coin2").value || "ethereum";
                const selectedCurrency = "${currency}";

                window.location.href = \`/compare?coin1=\${selectedCoin1}&coin2=\${selectedCoin2}&currency=\${selectedCurrency}\`;
            };
        </script>
      `;
        res.send(htmlContent);
    } catch (error) {
        res.status(500).send("Error fetching comparison data");
    }
});

router.get("/top-gainers-losers", async (req, res) => {
    const { currency = "usd" } = req.query;

    try {
        const response = await axios.get(
            `https://api.coingecko.com/api/v3/coins/markets`,
            {
                params: {
                    vs_currency: currency,
                    order: "market_cap_desc", // default
                    per_page: Infinity,
                    price_change_percentage: "24h",
                },
            }
        );
        const data = response.data;

        const gainers = data
            .filter((coin) => coin.price_change_percentage_24h > 0)
            .sort(
                (a, b) =>
                    b.price_change_percentage_24h -
                    a.price_change_percentage_24h
            )
            .slice(0, 5);

        const losers = data
            .filter((coin) => coin.price_change_percentage_24h < 0)
            .sort(
                (a, b) =>
                    a.price_change_percentage_24h -
                    b.price_change_percentage_24h
            )
            .slice(0, 5);

        // If the request expects JSON
        if (req.headers.accept.includes("application/json")) {
            return res.json({ gainers, losers });
        }

        // If the request expects HTML
        let htmlContent = `<h1>Top Gainers and Losers (Last 24 hours)</h1>
        <h2>Top 5 Gainers</h2>
        <ul>`;
        gainers.forEach((coin) => {
            htmlContent += `<li>${coin.name}: ${coin.price_change_percentage_24h}%</li>`;
        });
        htmlContent += `</ul><h2>Top 5 Losers</h2><ul>`;
        losers.forEach((coin) => {
            htmlContent += `<li>${coin.name}: ${coin.price_change_percentage_24h}%</li>`;
        });
        htmlContent += "</ul>";
        res.send(htmlContent);
    } catch (error) {
        console.error("Error fetching gainers and losers data: ", error);
        res.status(500).send("Error fetching gainers and losers data");
    }
});

module.exports = router;
