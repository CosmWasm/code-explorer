import { GasPrice } from "@cosmjs/stargate";

export type NonEmptyArray<ElementType> = { readonly 0: ElementType } & readonly ElementType[];

export interface BackendSettings {
  readonly nodeUrls: NonEmptyArray<string>;
  readonly denominations: readonly string[];
  readonly addressPrefix: string;
  readonly gasPrice: GasPrice;
  readonly keplrChainInfo?: any;
}

const devnetStargateSettings: BackendSettings = {
  nodeUrls: ["http://localhost:26659"],
  denominations: ["ucosm", "ustake"],
  addressPrefix: "wasm",
  gasPrice: GasPrice.fromString("0.25ucosm"),
};

const musselnetSettings: BackendSettings = {
  nodeUrls: ["https://rpc.musselnet.cosmwasm.com"],
  denominations: ["umayo", "ufrites"],
  addressPrefix: "wasm",
  gasPrice: GasPrice.fromString("0.25ucosm"),
};

const pebblenetSettings: BackendSettings = {
  nodeUrls: ["https://rpc.pebblenet.cosmwasm.com"],
  denominations: ["upebble"],
  addressPrefix: "wasm",
  gasPrice: GasPrice.fromString("0.25ucosm"),
  keplrChainInfo: {
    rpc: "https://rpc.pebblenet.cosmwasm.com",
    rest: "https://lcd.pebblenet.cosmwasm.com",
    chainId: "pebblenet-1",
    chainName: "Wasm Pebblenet",
    stakeCurrency: {
      coinDenom: "PEBBLE",
      coinMinimalDenom: "upebble",
      coinDecimals: 6,
    },
    bip44: {
      coinType: 118,
    },
    bech32Config: {
      bech32PrefixAccAddr: "wasm",
      bech32PrefixAccPub: "wasmpub",
      bech32PrefixValAddr: "wasmvaloper",
      bech32PrefixValPub: "wasmvaloperpub",
      bech32PrefixConsAddr: "wasmvalcons",
      bech32PrefixConsPub: "wasmvalconspub",
    },
    currencies: [
      {
        coinDenom: "PEBBLE",
        coinMinimalDenom: "upebble",
        coinDecimals: 6,
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "PEBBLE",
        coinMinimalDenom: "upebble",
        coinDecimals: 6,
      },
    ],
    features: ["stargate", "ibc-transfer", "cosmwasm"],
    explorerUrlToTx: "https://block-explorer.pebblenet.cosmwasm.com/transactions/{txHash}",
  },
};

const uniSettings: BackendSettings = {
  nodeUrls: ["https://rpc.juno.giansalex.dev"],
  denominations: ["ujunox"],
  addressPrefix: "juno",
  gasPrice: GasPrice.fromString("0.25ucosm"),
  keplrChainInfo: {
    rpc: "https://rpc.juno.giansalex.dev:443",
    rest: "https://lcd.juno.giansalex.dev:443",
    chainId: "uni",
    chainName: "Juno Testnet",
    stakeCurrency: {
      coinDenom: "JUNOX",
      coinMinimalDenom: "ujunox",
      coinDecimals: 6,
    },
    bip44: {
      coinType: 118,
    },
    bech32Config: {
      bech32PrefixAccAddr: "juno",
      bech32PrefixAccPub: "junopub",
      bech32PrefixValAddr: "junovaloper",
      bech32PrefixValPub: "junovaloperpub",
      bech32PrefixConsAddr: "junovalcons",
      bech32PrefixConsPub: "junovalconspub",
    },
    currencies: [
      {
        coinDenom: "JUNOX",
        coinMinimalDenom: "ujunox",
        coinDecimals: 6,
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "JUNOX",
        coinMinimalDenom: "ujunox",
        coinDecimals: 6,
      },
    ],
    features: ["stargate", "ibc-transfer", "cosmwasm", "no-legacy-stdTx"],
    explorerUrlToTx: "https://uni.junoscan.com/transactions/{txHash}",
  },
};

const knownBackends: Partial<Record<string, BackendSettings>> = {
  devnetStargate: devnetStargateSettings,
  musselnet: musselnetSettings,
  pebblenet: pebblenetSettings,
  uninet: uniSettings,
};

export function getCurrentBackend(): BackendSettings {
  const id = process.env.REACT_APP_BACKEND || "uninet";
  const backend = knownBackends[id];
  if (!backend) {
    throw new Error(`No backend found for the given ID "${id}"`);
  }
  return backend;
}
