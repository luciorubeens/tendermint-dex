# Tendermint DEX

Frontend Engineer in the Developer Experience team at Tendermint will be working on web app for interacting with blockchain apps powered by blockchains in the Cosmos ecosystem. One of
components of this web app is a UI for an AMM-style decentralized token exchange (think Uniswap).

## Goal

Build a Uniswap-like UI for swapping tokens and creating pools for the module. UI is built using Vue 3 and TypeScript. Visual design is not evaluated as part of this task, so it just has to
functional.

## Running

The main repository is automatically compiled at each commit by Netlify and is available at the link below:

https://tendermint-dex.netlify.app/

### Instructions

To enter in the liquidity module there is a new link available in the sidebar.

You can also use the routes:

```
/liquidity
/liquidity/pools/create
/liquidity/pools/:id
```

After creating a pool you can access the pool details page, there you can do the Swap, Deposit and Whitdraw.

## Development

Almost all the code related to the liquidity module is located at `/vue/src/modules/liquidity`.

I used the power of the new Vue Composition API because it allows us to reuse common parts used across the project, while the `@starport/vuex` package together with the auto generated liquidity module provides all the global state necessary to build the UI.

### Requirements

- Node 14.x
- Go 1.16.x
- Starpot 0.15.x

### Setup

```bash
git clone https://github.com/tendermint/starport ~/ cd starport && git checkout develop && make # Install starport
git clone https://github.com/luciorubeens/tendermint-dex.git && cd tendermint-dex  # Clone the project
starport serve -r --rebuild-proto-once # Run development server
```

## Testing

I wrote some E2E tests using Cypress that can run directly on the Gravity Testnet. It is currently flasky because the http requisitions must be intercepted and replaced by fixtures.

You can run it using:

```bash
cd vue && npm run test:e2e
```

Or if you want to run locally against your local starport instance:

```bash
starport serve -r
cd vue && npm run test:e2e:local
```

A Github workflow is configured to run on every push/pull request.

## Know Bugs

- The calculations for estimating how much will be received when swap is not correct, as well as the fees. I tried to follow the docs and even look at the Gravity DEX source code but no luck, the API may return an error so please try other values. Example: when requesting the swap of `1000` uusd it may not work, the try `1005`.

- Sometimes it is not possible to unlock imported wallets due to `Malformed UTF-8` error, it is not related to my changes as it happens in staport fresh instances.
