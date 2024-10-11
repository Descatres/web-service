const express = require("express");
const fetch = require("node-fetch");
const router = express.Router();

//coins list chosen arbitrarely by me
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

router.get("/", (_req, res) => {
  res.sendFile(__dirname + "../public/index.html");
});

router.get("/crypto", async (req, res) => {
  const { coin = coinList, currency = "usd", resp = "html" } = req.query;
  const updateInterval = 60 * 1000; // Update every 60 seconds
  const nextUpdateTime = Date.now() + updateInterval;

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=${currency}`
    );
    const data = await response.json();

    const sortedCoins = Object.keys(data).sort(
      (a, b) => data[b][currency] - data[a][currency]
    );

    let totalValue = 0;
    sortedCoins.forEach((coinName) => {
      totalValue += data[coinName][currency];
    });

    let averageValue = totalValue / sortedCoins.length;
    const lastUpdated = new Date().toLocaleString();

    if (resp === "json" || req.headers.accept.includes("application/json")) {
      return res.json({
        sortedCoins,
        totalValue,
        averageValue,
        data,
        lastUpdated,
        nextUpdateTime,
      });
    }

    let htmlResponse = `<h1>Cryptocurrency Prices (Ordered by Price)</h1><ul>`;
    sortedCoins.forEach((coinName) => {
      htmlResponse += `<li>${coinName.toUpperCase()}: ${
        data[coinName][currency]
      } ${currency.toUpperCase()}</li>`;
    });
    htmlResponse += `<br><strong>Total Value:</strong> ${totalValue.toFixed(
      4
    )} ${currency.toUpperCase()}
      <br><strong>Average Value:</strong> ${averageValue.toFixed(
        4
      )} ${currency.toUpperCase()}
      <br><strong>Last Updated:</strong> ${lastUpdated}
      <br><strong>Next Update in:</strong> <span id="timer"></span>
      `;
    htmlResponse += `</ul>`;
    htmlResponse += `<script>
      const nextUpdateTime = ${nextUpdateTime};
      const timerElement = document.getElementById('timer');
      function updateTimer() {
          const now = new Date().getTime();
          const timeLeft = nextUpdateTime - now;
          if (timeLeft > 0) {
              const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
              const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
              timerElement.innerHTML = minutes + "m " + seconds + "s";
          } else {
              timerElement.innerHTML = "Updating...";
              setTimeout(() => location.reload(), 1000); // Reload page after update
          }
      }
      setInterval(updateTimer, 1000); // Update the countdown every second
    </script>`;

    res.send(htmlResponse);
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

router.get("/filter", async (req, res) => {
  const {
    coin = coinList,
    minPrice = 0,
    currency = "usd",
    resp = "html",
  } = req.query;

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=${currency}`
    );

    const data = await response.json();

    const filteredCoins = Object.keys(data).filter(
      (coin) => data[coin][currency] >= minPrice
    );

    const prices = filteredCoins.map((coin) => data[coin][currency]);

    if (resp === "json" || req.headers.accept.includes("application/json")) {
      return res.json({ filteredCoins, prices, currency });
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
    resp = "html",
  } = req.query;

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coin1},${coin2}&vs_currencies=${currency}`
    );

    const data = await response.json();

    const price1 = data[coin1][currency];
    const price2 = data[coin2][currency];
    const difference = Math.abs(price1 - price2);

    if (resp === "json" || req.headers.accept.includes("application/json")) {
      return res.json({ coin1, price1, coin2, price2, difference, currency });
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
  const { currency = "usd", resp = "html" } = req.query;

  try {
    // const response = await fetch(
    //   `https://api.coingecko.com/api/v3/coins/markets`,
    //   {
    //     params: {
    //       vs_currency: currency,
    //       order: "market_cap_desc",
    //       per_page: Infinity,
    //       price_change_percentage: "24h",
    //     },
    //   }
    // );
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=Infinity&page=1&price_change_percentage=24h`
    );
    // const data = response.data;
    const data = await response.json();

    const gainers = data
      .filter((coin) => coin.price_change_percentage_24h > 0)
      .sort(
        (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
      )
      .slice(0, 5);

    const gainersNames = gainers.map((coin) => coin.name);
    const gainersPrice = gainers.map((coin) => coin.current_price);
    const gainersPercentage = gainers.map(
      (coin) => coin.price_change_percentage_24h
    );

    const losers = data
      .filter((coin) => coin.price_change_percentage_24h < 0)
      .sort(
        (a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h
      )
      .slice(0, 5);

    const losersNames = losers.map((coin) => coin.name);
    const losersPrice = losers.map((coin) => coin.current_price);
    const losersPercentage = losers.map(
      (coin) => coin.price_change_percentage_24h
    );

    if (resp === "json" || req.headers.accept.includes("application/json")) {
      return res.json({
        gainersNames,
        gainersPrice,
        gainersPercentage,
        losersNames,
        losersPrice,
        losersPercentage,
        currency,
      });
    }

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
