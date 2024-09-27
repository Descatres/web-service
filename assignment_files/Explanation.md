# Why [CoinGecko API](https://www.coingecko.com/en/api)

CoinGecko keeps track of over 2 million cryptocurrencies ([according to their website](https://www.coingecko.com/en/api#:~:text=Historical%20data-,2M%2B,Coins,-100%2B)) and provides data for coins, NFTs, exchanges, exchange rates, etc. I chose to only "play" with coins (namely, cryptocurrencies) but creating webservices for the other APIs is as simple as done for the coins. For these, I chose to, as stated on the [readme features](../README.md/#Features):

-   View price for top20 cryptocurrencies (price)
-   Filter cryptocurrencies by minimum price
-   Compare top20 cryptocurrencies
-   Top5 and bottom5 cryptocurrencies (% in the last 24h)
-   Select euro or dollar as currency
-   Get responses in HTML or JSON

CoinGecko API is free to use and does not require an API key, making it very suitable, in my opinion, for this project (this way I don't have to bother with unwanted complexity and focus just on the objective of the assignment).
Although, there is a rate limit of ~30 calls per minute, which is _more than enough_\* for this project ([source](<https://docs.coingecko.com/reference/common-errors-rate-limit#:~:text=For%20Public%20API%20user%20(Demo%20plan)%2C%20the%20rate%20limit%20is%20~30%20calls%20per%20minutes%20and%20it%20varies%20depending%20on%20the%20traffic%20size.>)).

\*_For more complex analysis it is not enough, as I came to find out -> I'd like to do overtime analysis (price volatility over a specified time period by comparing price changes) but the free version of the API would run out of requests quickly, rendering it unusable._
