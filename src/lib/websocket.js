const url = 'wss://ws.kraken.com/v2'

// Kraken silently ignores a subscription that lists every pair at once.
const pairsPerSubscription = 100

const initialReconnectDelayMs = 1000
const maxReconnectDelayMs = 30000

export function initWebSocket({ handleTickerMessage, handleTradeMessage }) {

  let ws
  let reconnectTimer
  let reconnectAttempts = 0
  let closed = false

  const connect = () => {
    ws = new WebSocket(url)

    ws.onopen = () => {
      reconnectAttempts = 0
      subscribeToInstruments(ws)
    }

    ws.onmessage = event => {
      handleMessage(JSON.parse(event.data), { ws, handleTickerMessage, handleTradeMessage })
    }

    ws.onerror = event => {
      console.error('Received error', event)
    }

    ws.onclose = () => {
      if (!closed) {
        reconnectTimer = setTimeout(connect, reconnectDelay(reconnectAttempts++))
      }
    }
  }

  connect()

  return () => {
    closed = true
    clearTimeout(reconnectTimer)
    ws.close()
  }
}

const reconnectDelay = attempts =>
  Math.min(initialReconnectDelayMs * 2 ** attempts, maxReconnectDelayMs)

const subscribeToInstruments = ws => {
  ws.send(JSON.stringify({
    method: 'subscribe',
    params: {
      channel: 'instrument'
    }
  }))
}

const subscribeToPairs = (ws, channel, pairs, options) => {
  for (let start = 0; start < pairs.length; start += pairsPerSubscription) {
    ws.send(JSON.stringify({
      method: 'subscribe',
      params: {
        channel,
        symbol: pairs.slice(start, start + pairsPerSubscription),
        ...options
      }
    }))
  }
}

const handleInstruments = (ws, pairs) => {
  subscribeToPairs(ws, 'ticker', pairs)
  subscribeToPairs(ws, 'trade', pairs, { snapshot: false })
}

const handleMessage = (message, { ws, handleTickerMessage, handleTradeMessage }) => {
  if (message.hasOwnProperty('method')) {
    if (!message.success) {
      console.error('Request error:', message.method, message.symbol, message.error)
    }
  }
  else {
    switch (message.channel) {
      case 'instrument':
        if (message.type === 'snapshot') {
          handleInstruments(ws, message.data.pairs.map(pair => pair.symbol))
        }
        break
      case 'ticker':
        message.data.forEach(handleTickerMessage)
        break
      case 'trade':
        message.data.forEach(handleTradeMessage)
        break
      case 'heartbeat':
      case 'status':
        break
      default:
        console.error('Unknown channel:', message.channel)
        break
    }
  }
}
