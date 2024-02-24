const API_KEY =
    '4caa95b1312b4ddfca598bf879d242dd3c2c8cc635c161e4e515758bd82717e9'

const tickersHandlers = new Map(); // { }

// TODO: refactor to use UrlSearchParams - current version is not safe
const loadTickers = () => {
    if (tickersHandlers.size === 0) {
        return;
    }

    fetch(
        `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[
            ...tickersHandlers.keys()]
            .join(
                ","
            )}&tsyms=USD&api_key=${API_KEY}`
    ).then(r => r.json())
        // this logic should be in this API call part so that, so that component
        // just call the function without diving into tech details
        // *generally some mapping api data mappings or modifications should be performed in specific
        // component based on the business reqs, but in this case it just technical logic
        // to normalize API response data
        .then(rawData => {
            const updatedPrices = Object.fromEntries(
                Object.entries(rawData).map(([key, value]) => [key, value.USD])
            )
            Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
                const handlers = tickersHandlers.get(currency) ?? [];
                handlers.forEach(fn => fn(newPrice))
            })
        })
}

export const subscribeToTicker = (ticker, cb) => {
    const subscribers = tickersHandlers.get(ticker) || [];
    tickersHandlers.set(ticker, [...subscribers, cb]);
}

export const unsubscribeFromTicker = ticker => {
    tickersHandlers.delete(ticker);
}

setInterval(loadTickers, 5000)

window.tickers = tickersHandlers
// the idea of API call extraction is not in receiving the crypto prices
// the idea is to receive UPDATES for crypto prices