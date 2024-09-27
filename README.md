# Crytocurrency web service using CoinGecko API

_Assignment 1 - DW course_

## How to run

-   ### Install dependencies:

```bash
    npm i
```

-   ### Normal build:

```bash
    npm start
```

-   ### Developement build:

```bash
    npm run dev
```

## Features

-   View price for top20 cryptocurrencies (price)
-   Filter cryptocurrencies by minimum price
-   Compare top20 cryptocurrencies
-   Top5 and bottom5 cryptocurrencies (% in the last 24h)
-   Select euro or dollar as currency
-   Get responses in HTML or JSON

Notes:

-   The frontend is not ideal as it is but, since that is not the objective of this assignment, I kept it simple to save time and not need to change the link manually to do different requests.
-   The 20 coins which are shown on most of the pages are 20 hand selected coins, except for the top and bot page, that show the top 5 and bottom 5 coins by % change in the last 24h from all coins. The coins were picked by being the top 20 (market cap) and to not waste time with the API rate limit doing an additional request to get the top 20 coins at least once per session/fixed set date/localstorage expiry date.
