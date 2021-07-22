# Juno Code Explorer

## Use hosted

The explorer is deployed at https://giansalex.github.io/code-explorer and is configured
for [Lucina](https://github.com/CosmosContracts/testnets/tree/main/lucina).

## Use local

You need to install the code-explorer dependencies before choosing which network you want to connect to:

```sh
yarn install
```

### Run against testnets

You don't need to run a local network in order to connect to the testnets, you just need the right start script for each network.

#### Lucina

```sh
yarn start-lucinanet
```

### Run against local networks

Clone the CosmJS repo in order to run a local Stargate network:

```sh
git clone --depth 1 --branch v0.25.5 https://github.com/cosmos/cosmjs.git
```

Also make sure to comply with the [prerequisites](https://github.com/cosmos/cosmjs/blob/v0.25.5/HACKING.md#prerequisite).

#### Stargate

In order to run a local Stargate network, follow [these instructions](https://github.com/cosmos/cosmjs/tree/v0.25.5/scripts/wasmd).

The start script that makes the code-explorer connect to a local Stargate network is:

```sh
yarn start-stargate
```

## Build instructions

You can build a code explorer and deploy it as static HTML/JS files.

Requirements: yarn, Node.js 10+

```
yarn install
PUBLIC_URL=https://code-explorer.junochain.com/ REACT_APP_BACKEND=lucinanet yarn build
```

## Credits

Background image from https://unsplash.com/photos/QqCLSA3EQUg
