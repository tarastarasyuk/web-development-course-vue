const API_KEY =
    '4caa95b1312b4ddfca598bf879d242dd3c2c8cc635c161e4e515758bd82717e9'

const tickersHandlers = new Map(); // { }
const socket = new WebSocket(
    `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
)

// const AGGREGATE_INDEX = "5";
const INVALID_SUB = "500";

socket.addEventListener('message', e => {
    let {TYPE: type, FROMSYMBOL: currency, PRICE: newPrice, PARAMETER: parameter} = JSON.parse(
        e.data
    );

    let isValid = true;
    if (type === INVALID_SUB) {
        isValid = false;
        currency = extractTicker(parameter);
    } else if (type !== INVALID_SUB && newPrice === undefined) {
        return;
    }

    const handlers = tickersHandlers.get(currency) ?? [];
    handlers.forEach(fn => fn(newPrice, isValid))
})

function extractTicker(ticker) {
    if (!ticker) {
        return null;
    }

    const match = ticker.match(/5~CCCAGG~(.*)~USD/);
    if (match) {
        const ticker = match[1];
        return ticker;
    }
    return null;
}

function sendToWebSocket(message) {
    const stringifiedMessage = JSON.stringify(message);

    if (socket.readyState === WebSocket.OPEN) {
        socket.send(stringifiedMessage);
        return;
    }

    socket.addEventListener(
        'open',
        () => {
            socket.send(stringifiedMessage)
        },
        {once: true}
    );
}

function subscribeToTickerOnWs(ticker) {
    sendToWebSocket({
        "action": "SubAdd",
        "subs": [`5~CCCAGG~${ticker}~USD`]
    });
}

function unsubscribeFromTickerOnWs(ticker) {
    sendToWebSocket({
        "action": "SubRemove",
        "subs": [`5~CCCAGG~${ticker}~USD`]
    });
}

export const subscribeToTicker = (ticker, cb) => {
    const subscribers = tickersHandlers.get(ticker) || [];
    tickersHandlers.set(ticker, [...subscribers, cb]);
    subscribeToTickerOnWs(ticker);
}

export const unsubscribeFromTicker = ticker => {
    tickersHandlers.delete(ticker);
    unsubscribeFromTickerOnWs(ticker);
}

window.tickers = tickersHandlers
// the idea of API call extraction is not in receiving the crypto prices
// the idea is to receive UPDATES for crypto prices