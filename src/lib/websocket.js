const url = 'wss://ws.kraken.com'

// Kraken silently ignores a subscription that lists every pair at once.
const pairsPerSubscription = 100

const initialReconnectDelayMs = 1000
const maxReconnectDelayMs = 30000

export function initWebSocket({ pairs, handleTickerMessage }) {

  let ws
  let reconnectTimer
  let reconnectAttempts = 0
  let closed = false

  const connect = () => {
    ws = new WebSocket(url)

    ws.onopen = () => {
      reconnectAttempts = 0
      subscribeToTickers(ws, pairs)
    }

    ws.onmessage = event => {
      handleMessage(JSON.parse(event.data), { handleTickerMessage })
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

const subscribeToTickers = (ws, pairs) => {
  for (let start = 0; start < pairs.length; start += pairsPerSubscription) {
    ws.send(JSON.stringify({
      event: 'subscribe',
      pair: pairs.slice(start, start + pairsPerSubscription),
      subscription: {
        name: 'ticker'
      }
    }))
  }
}

const handleMessage = (data, { handleTickerMessage }) => {
  if (data.hasOwnProperty('event')) {

    switch (data.event) {
      case 'subscriptionStatus':
        if (data.status === 'error') {
          console.error('Subscription error:', data.pair, data.errorMessage)
        }
        break
      case 'heartbeat':
      case 'systemStatus':
        break
      default:
        console.error('Unknown event:', data.event)
        break
    }
  }
  else {
    const [, ticker, channel, pair] = data
    switch (channel) {
      case 'ticker':
        handleTickerMessage(ticker, pair)
        break
      default:
        console.error('Unknown channel:', channel)
        break
    }
  }
}
