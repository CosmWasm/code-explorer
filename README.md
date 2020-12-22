# CosmWasm Code Explorer

## Use hosted

The explorer is deployed at https://cosmwasm.github.io/code-explorer and is configured
for [Heldernet](https://gist.github.com/webmaster128/6385a7e1885211d9937ada2688ce34c3).

## Use local

You need to install the code-explorer dependencies before choosing which network you want to connect to:

```sh
yarn install
```

### Run against testnets

You don't need to run a local network in order to connect to the testnets, you just need the right start script for each network.

#### Heldernet

```sh
yarn start-heldernet
```

#### Coralnet

```sh
yarn start-coralnet
```

#### Musslenet

Coming soon!

### Run against local networks

Clone the CosmJS repo in order to run a local Launchpad or Stargate network:

```sh
git clone --depth 1 --branch v0.24.0-alpha.11 git@github.com:cosmos/cosmjs.git
```

Also make sure to comply with the [prerequisites](https://github.com/cosmos/cosmjs/blob/v0.24.0-alpha.11/HACKING.md#prerequisite).

#### Launchpad

In order to run a local Launchpad network follow [these instructions](https://github.com/cosmos/cosmjs/tree/v0.24.0-alpha.11/scripts/launchpad).

The start script that makes the code-explorer connect to a local Launchpad network is:

```sh
yarn start-launchpad
```

#### Stargate

In order to run a local Stargate network, follow [these instructions](https://github.com/cosmos/cosmjs/tree/v0.24.0-alpha.11/scripts/wasmd).

The start script that makes the code-explorer connect to a local Stargate network is:

```sh
yarn start-stargate
```

## Credits

Background image from https://unsplash.com/photos/QqCLSA3EQUg
