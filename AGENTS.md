# AGENTS.md

Static React 19 + Vite + Tailwind 4 page that streams every Kraken pair over the public WebSocket API v2 and ranks pairs by 24-hour USD volume. No backend and no API key. Commands are in `package.json` and the README; CI runs `pnpm test` and `pnpm build`, and every push to `master` deploys `dist` to GitHub Pages under the `/kraken-ticker/` base path set in `vite.config.js`.

## Data flow

- `src/lib/websocket.js` subscribes to the `instrument` channel, then subscribes to `ticker` and `trade` for every pair from its snapshot, in batches of 100: Kraken silently ignores a subscription that lists every pair at once. It reconnects with exponential backoff.
- `src/lib/kraken.js` maps v2 messages to the app's ticker and trade shapes. Field names from the API stay there.
- `src/lib/tickerStore.js` is a framework-free external store. Updates mark pairs dirty and are flushed once per animation frame; listeners are per pair, for the row order, and for the header stats. Keep React out of it so it stays unit-testable with an injected `scheduleFrame`.
- `src/lib/useTickerStore.js` binds the store to React with `useSyncExternalStore`. Each `TickerRow` subscribes to its own pair, so one tick re-renders one row, not the table.
- `src/utils/usdVolume.js` converts a pair's quote volume to USD through `QUOTE/USD`, or the inverse of `USD/QUOTE`. A pair with neither has no USD volume and sorts last.

## Conventions

- Keep the per-frame batching and per-pair subscriptions intact: hundreds of pairs tick several times a second, and a table-wide re-render per message freezes the page.
- Unit tests sit next to the code as `*.test.js` (Vitest). Add one for any change to the store or the `utils/` maths.
- Columns appear as the table widens through custom container-query variants (`@bid-ask:`, `@low-high:` and the rest), whose `ch` breakpoints and `@variant` rules live in `src/index.css`. Add a column there, not with viewport breakpoints.
