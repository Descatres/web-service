# Crytocurrency web service using CoinGecko API

_Assignment 1 - DW course_

## How to run

- ### Install dependencies:

```bash
    npm i
```

- ### Normal build:

```bash
    npm start
```

- ### Developement build:

```bash
    npm run dev
```

## Features

- View price for 20 cryptocurrencies
- Filter cryptocurrencies by minimum price
- Compare top20 cryptocurrencies
- Top5 and bottom5 cryptocurrencies (% in the last 24h)
- Select euro or dollar as currency
- Get responses in HTML or JSON

## Examples

- **Selected coins**: _bitcoin_, _ethereum_, _cardano_, _binancecoin_, _tether_, _solana_, _xrp_, _dogecoin_, _polkadot_, _litecoin_, _chainlink_, _stellar_, _vechain_, _uniswap_, _aave_, _cosmos_, _tron_, _algorand_, _theta_, _tezos_.
- "currency" can be either "eur" or "usd" and the result will be in the selected currency
- "resp" can be either "json" or "html" and the result will be in the selected format

### View price for 20 cryptocurrencies

```
"http://localhost:3000/crypto?currency=eur&resp=json"
"http://localhost:3000/crypto?currency=usd&resp=json"
"http://localhost:3000/crypto?currency=eur&resp=html"
"http://localhost:3000/crypto?currency=usd&resp=html"
```

### Filter cryptocurrencies by minimum price

```
"http://localhost:3000/filter?minPrice=1000&currency=eur&resp=html"
"http://localhost:3000/filter?minPrice=1000&currency=usd&resp=html"
"http://localhost:3000/filter?minPrice=1000&currency=eur&resp=json"
"http://localhost:3000/filter?minPrice=1000&currency=usd&resp=json"
```

- minPrice is the minimum price in the selected currency, it can be any number

### Compare top20 cryptocurrencies

```
"http://localhost:3000/compare?coin1=bitcoin&coin2=ethereum&currency=eur&resp=json"
"http://localhost:3000/compare?coin1=bitcoin&coin2=ethereum&currency=usd&resp=json"
"http://localhost:3000/compare?coin1=bitcoin&coin2=ethereum&currency=eur&resp=html"
"http://localhost:3000/compare?coin1=bitcoin&coin2=ethereum&currency=usd&resp=html"
```

- coin1 and coin2 are the names of the cryptocurrencies to compare, **they can be any of the 20 selected coins**

### Top5 and bottom5 cryptocurrencies (% in the last 24h)

```
"http://localhost:3000/top-gainers-losers?currency=eur&resp=html"
"http://localhost:3000/top-gainers-losers?currency=usd&resp=html"
"http://localhost:3000/top-gainers-losers?currency=eur&resp=json"
"http://localhost:3000/top-gainers-losers?currency=usd&resp=json"
```

Notes:

- The frontend is not ideal as it is but, since that is not the objective of this assignment, I kept it simple to save time and not need to change the link manually to do different requests.
- The 20 coins which are shown on most of the pages are 20 hand selected coins, except for the top and bot page, that show the top 5 and bottom 5 coins by % change in the last 24h from all coins. The coins were picked arbitrarily in order to not waste time with the API rate limit doing an additional request to get the top 20 coins (which was my initial idea) every time the page is (re)loaded.
- You can check the [explanation here](/assignment_files/Explanation.md)

```

```
