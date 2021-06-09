# Tendermint DEX

A Uniswap-like UI for swapping tokens and creating pools for the [tendermint/liquidity](https://github.com/tendermint/liquidity) module.

Built using the Cosmos SDK and Tendermint, and generated with [Starport](https://docs.starport.network/).

## Demo

⚠️ This project is still an early beta, missing features and bugs are to be expected!

The demo version runs in the [Gravity Dex Testnet](https://github.com/b-harvest/gravity-dex-testnets) network.

You can access the last commit deployed at:

https://tendermint-dex.netlify.app/

## Development

Almost all the UI code related to the liquidity module is located at `/vue/src/modules/liquidity`.

For development the app will use your local starport running instance. Just import the auto-generated Alice's mnemonic and start creating a pool.

### Requirements

- Node 14.x
- Go 1.16.x
- Starpot 0.15.x

### Quick Start

```bash
# Install starport
git clone https://github.com/tendermint/starport ~/
cd ~/starport
git checkout develop && make

# Clone this project
git clone https://github.com/luciorubeens/tendermint-dex.git
cd tendermint-dex 

# Run development server
starport serve -r --rebuild-proto-once
```

### Config

You can change the environment network by creating a `/vue/.env` file with:

```
VUE_APP_NODE_ENV=production
VUE_APP_API_COSMOS=https://api.gravity.bharvest.io
VUE_APP_WS_TENDERMINT=wss://rpc.gravity.bharvest.io/websocket
VUE_APP_API_TENDERMINT=https://rpc.gravity.bharvest.io
VUE_APP_ADDRESS_PREFIX=cosmos
```

## Testing

Some E2E tests available using Cypress. NOTE: It is currently unstable because http requests must be intercepted and replaced by fixtures.

Run the following command for production/demo environment:

```bash
cd vue && npm run test:e2e
```

For local development, run:

```bash
starport serve -r
cd vue && npm run test:e2e:local
```

## Known Bugs

- Gas/fee issues in Gravity Testnet to send transactions.
- The calculations for estimating how much will be received when swap is not correct, as well as the fees.
