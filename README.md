# kraken-ticker

Live Kraken ticker for all asset pairs, sorted by 24-hour volume in USD, with each pair's share of the total. A header shows the number of trades and the USD volume since page load and over the last 24 hours. Prices and trades stream over the Kraken WebSocket API v2.

Demo @ https://nyg.github.io/kraken-ticker

## Development

```sh
pnpm install
pnpm dev
```

`pnpm test` runs the unit tests and `pnpm build` writes the production build to `dist`. Every push to `master` builds and deploys to GitHub Pages.
