# 🪐Gravity-DEX for testnets ( Gaia + Liquidity Module )

Implementation with [tendermint/liquidity](https://github.com/tendermint/liquidity) module functionality added to [cosmos/gaia](https://github.com/cosmos/gaia)

## Resources
 - [Liquidity Module Spec](https://github.com/tendermint/liquidity/tree/develop/x/liquidity/spec)
 - [Liquidity Module Lite Paper (English)](https://github.com/tendermint/liquidity/tree/develop/doc/LiquidityModuleLightPaper_EN.pdf)
 - [Liquidity Module Lite Paper (Korean)](https://github.com/tendermint/liquidity/tree/develop/doc/LiquidityModuleLightPaper_KO.pdf)
 - [Liquidity Module Lite Paper (Chinese)](https://github.com/tendermint/liquidity/tree/develop/doc/LiquidityModuleLightPaper_ZH.pdf)
 - [Proposal and milestone](https://github.com/b-harvest/Liquidity-Module-For-the-Hub)
 - [Swagger HTTP API doc](https://app.swaggerhub.com/apis-docs/bharvest/cosmos-sdk_liquidity_module_rest_and_g_rpc_gateway_docs)
 - [godoc](https://pkg.go.dev/github.com/tendermint/liquidity)
 - [Client doc](https://github.com/tendermint/liquidity/tree/develop/doc/client.md)


## Installation

### Requirements

| Requirement | Notes            |
| ----------- | ---------------- |
| Go version  | Go1.15 or higher |
| based gaia  | v4.2.1           |
| Cosmos-SDK  | v0.42.4          |
| liquidity   | v1.2.4           |

### Get gravity-dex source code

```bash
$ git clone https://github.com/b-harvest/gravity-dex.git
$ cd gravity-dex
```

### Build

```bash
$ make build 
```

You can find the `gaiad` binary on `build/`

### Install

```bash
$ make install 
```

## gaiad

### Tx


`$ gaiad tx liquidity --help`

```bash
Liquidity transaction subcommands

Usage:
  gaiad tx liquidity [flags]
  gaiad tx liquidity [command]

Available Commands:
  create-pool Create new liquidity pool with the specified pool type and deposit coins
  deposit     Deposit coins to the specified liquidity pool
  swap        Swap offer coin with demand coin from the specified liquidity pool with the given order price
  withdraw    Withdraw pool coin from the specified liquidity pool
```

### Query

`$ gaiad query liquidity --help`

```bash
Querying commands for the liquidity module

Usage:
  gaiad query liquidity [flags]
  gaiad query liquidity [command]

Available Commands:
  batch       Query details of a liquidity pool batch of the pool
  deposit     Query for the deposit message on the batch of the liquidity pool specified pool-id and msg-index
  deposits    Query for all deposit messages on the batch of the liquidity pool specified pool-id
  params      Query the current liquidity parameters information
  pool        Query details of a liquidity pool
  pools       Query for all liquidity pools
  swap        Query for the swap message on the batch of the liquidity pool specified pool-id and msg-index
  swaps       Query for all swap messages on the batch of the liquidity pool specified pool-id
  withdraw    Query for the withdraw message on the batch of the liquidity pool specified pool-id and msg-index
  withdraws   Query for all withdraw messages on the batch of the liquidity pool specified pool-id
```

#### A detailed document on client can be found here. [client.md](doc/client.md)

## Development

### Test

```bash
$ make test
```

### Setup local testnet

Example of setup local testnet with test validator, user account

```bash
make install
gaiad init testing --chain-id testing
gaiad keys add validator --keyring-backend test
gaiad keys add user1 --keyring-backend test
gaiad add-genesis-account $(gaiad keys show validator --keyring-backend test -a) 10000000000stake,10000000000uatom,500000000000uusd
gaiad add-genesis-account $(gaiad keys show user1 --keyring-backend test -a) 10000000000stake,10000000000uatom,500000000000uusd
gaiad gentx validator 1000000000stake --chain-id testing --keyring-backend test
gaiad collect-gentxs
gaiad start
```

### Broadcasting Txs with cli

Example of creating test liquidity pool 1 using cli

```bash
gaiad tx liquidity create-pool 1 1000000000uatom,50000000000uusd --from user1 --keyring-backend test --chain-id testing -y
```

Example of creating test liquidity pool 2 using cli

```bash
gaiad tx liquidity create-pool 1 10000000stake,10000000uusd --from validator --keyring-backend test --chain-id testing -y
```

Example of Swap request using cli

```bash
gaiad tx liquidity swap 1 1 50000000uusd uatom 0.019 0.003 --from validator --chain-id testing --keyring-backend test -y
```

### Broadcasting Txs with REST

Example of broadcast txs the new REST endpoint (via gRPC-gateway),

example of generating unsigned tx 

```bash
validator=$(gaiad keys show validator --keyring-backend test -a)
gaiad tx liquidity swap 1 1 50000000uusd uatom 0.019 0.003 --from $validator --chain-id testing --generate-only > tx_swap.json
cat tx_swap.json
```

example of signing unsigned tx

```bash
gaiad tx sign tx_swap.json --from validator --chain-id testing --keyring-backend test -y > tx_swap_signed.json
cat tx_swap_signed.json
```

example of encoding signed tx

```bash
gaiad tx encode tx_swap_signed.json
```

example of the output: `Cp0BCpoBCigvdGVuZGVybWludC5saXF1aWRpdHkuTXNnU3dhcFdpdGhpbkJhdGNoEm4KLWNvc21vczE4cWM2ZGwwNDZ1a3V0MjN3NnF1dndmenBmeWhncDJmeHFkcXAwNhACGAEiEAoEdXVzZBIINTAwMDAwMDAqBXVhdG9tMg0KBHV1c2QSBTc1MDAwOhExOTAwMDAwMDAwMDAwMDAwMBJYClAKRgofL2Nvc21vcy5jcnlwdG8uc2VjcDI1NmsxLlB1YktleRIjCiEDsouFptHWGniIBzFrsE26PcfH950qjnf4RaEsd+g2fA0SBAoCCH8YAxIEEMCaDBpAOI3k8fay9TziZbl+eNCqmPEF7tWXua3ad0ldNR6XOgZjKRBP9sQSxCtaRFnqc6Avep9C4Rjt+CHDahRNpZ8u3A==`

example of broadcasting txs using the [new REST endpoint (via gRPC-gateway, beta1)](https://github.com/cosmos/cosmos-sdk/blob/master/docs/migrations/rest.md#migrating-to-new-rest-endpoints)
need to enable API server for test

```bash
curl --header "Content-Type: application/json" --request POST --data '{"tx_bytes":"Cp0BCpoBCigvdGVuZGVybWludC5saXF1aWRpdHkuTXNnU3dhcFdpdGhpbkJhdGNoEm4KLWNvc21vczE4cWM2ZGwwNDZ1a3V0MjN3NnF1dndmenBmeWhncDJmeHFkcXAwNhACGAEiEAoEdXVzZBIINTAwMDAwMDAqBXVhdG9tMg0KBHV1c2QSBTc1MDAwOhExOTAwMDAwMDAwMDAwMDAwMBJYClAKRgofL2Nvc21vcy5jcnlwdG8uc2VjcDI1NmsxLlB1YktleRIjCiEDsouFptHWGniIBzFrsE26PcfH950qjnf4RaEsd+g2fA0SBAoCCH8YAxIEEMCaDBpAOI3k8fay9TziZbl+eNCqmPEF7tWXua3ad0ldNR6XOgZjKRBP9sQSxCtaRFnqc6Avep9C4Rjt+CHDahRNpZ8u3A==","mode":1}' localhost:1317/cosmos/tx/v1beta1/txs
```
