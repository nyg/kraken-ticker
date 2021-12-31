export function initWebSocket({ onOpen, handleTickerMessage }) {

  const ws = new WebSocket('wss://ws.kraken.com')

  ws.onerror = event => {
    console.error('Received error', event)
  }

  ws.onmessage = event => {
    if (event.type === 'message') {
      handleMessage(JSON.parse(event.data), { handleTickerMessage })
    }
    else {
      console.error('Unknown message', event)
    }
  }

  ws.onclose = event => {
    console.log('Connection closed', event)
  }

  ws.onopen = event => {
    console.log('Connection opened')
    onOpen(event)
  }
}

const handleMessage = (data, { handleTickerMessage }) => {
  if (data.hasOwnProperty('event')) {

    switch (data.event) {
      case 'subscriptionStatus':
        // Ignore
        break
      case 'heartbeat':
        // Ignore
        break
      case 'systemStatus':
        console.log('System status:', data)
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
