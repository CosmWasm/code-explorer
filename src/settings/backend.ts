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

const coralnetSettings: BackendSettings = {
  nodeUrls: ["https://lcd.coralnet.cosmwasm.com"],
  denominations: ["ucosm", "ustake"],
  addressPrefix: "coral",
  gasPrice: GasPrice.fromString("0.25ucosm"),
};

const heldernetSettings: BackendSettings = {
  nodeUrls: ["https://lcd.heldernet.cosmwasm.com"],
  denominations: ["ucosm", "ustake"],
  addressPrefix: "cosmos",
  gasPrice: GasPrice.fromString("0.25ucosm"),
};

const musselnetSettings: BackendSettings = {
  nodeUrls: ["https://rpc.musselnet.cosmwasm.com"],
  denominations: ["umayo", "ufrites"],
  addressPrefix: "wasm",
  gasPrice: GasPrice.fromString("0.25ucosm"),
};

const oysternetSettings: BackendSettings = {
  nodeUrls: ["http://rpc.oysternet.cosmwasm.com"],
  denominations: ["usponge"],
  addressPrefix: "wasm",
  gasPrice: GasPrice.fromString("0.25ucosm"),
  keplrChainInfo: {
		rpc: 'http://rpc.oysternet.cosmwasm.com',
		rest: 'http://lcd.oysternet.cosmwasm.com',
		chainId: 'oysternet-1',
		chainName: 'Wasm Oysternet',
		stakeCurrency: {
			coinDenom: 'SPONGE',
			coinMinimalDenom: 'usponge',
			coinDecimals: 6
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
      bech32PrefixConsPub: "wasmvalconspub"
    },
		currencies: [
			{
				coinDenom: 'SPONGE',
				coinMinimalDenom: 'usponge',
				coinDecimals: 6
			},
		],
		feeCurrencies: [
			{
				coinDenom: 'SPONGE',
				coinMinimalDenom: 'usponge',
				coinDecimals: 6
			},
		],
		features: ['stargate']
	},
};

const knownBackends: Partial<Record<string, BackendSettings>> = {
  coralnet: coralnetSettings,
  heldernet: heldernetSettings,
  devnetStargate: devnetStargateSettings,
  musselnet: musselnetSettings,
  oysternet: oysternetSettings
};

export function getCurrentBackend(): BackendSettings {
  const id = process.env.REACT_APP_BACKEND || "devnetStargate";
  const backend = knownBackends[id];
  if (!backend) {
    throw new Error(`No backend found for the given ID "${id}"`);
  }
  return backend;
}
