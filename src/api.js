const API_KEY =
    '4caa95b1312b4ddfca598bf879d242dd3c2c8cc635c161e4e515758bd82717e9'

// TODO: refactor to use UrlSearchParams - current version is not safe
export const loadTickers = (tickers) =>
    fetch(
        `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${tickers.join(
            ","
        )}&tsyms=USD&api_key=${API_KEY}`
    ).then(r => r.json())
        // this logic should be in this API call part so that, so that component
        // just call the function without diving into tech details
        // *generally some mapping api data mappings or modifications should be performed in specific
        // component based on the business reqs, but in this case it just technical logic
        // to normalize API response data
        .then(rawData => Object.fromEntries(
            Object.entries(rawData).map(([key, value]) => [key, value.USD])
        ));
