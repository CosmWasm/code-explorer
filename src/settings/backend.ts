import { GasPrice } from "@cosmjs/stargate";

export type NonEmptyArray<ElementType> = { readonly 0: ElementType } & readonly ElementType[];

export interface BackendSettings {
  readonly nodeUrls: NonEmptyArray<string>;
  readonly stargateEnabled: boolean;
  readonly denominations: readonly string[];
  readonly addressPrefix: string;
  readonly gasPrice: GasPrice;
  readonly keplrChainInfo?: any;
}

const devnetStargateSettings: BackendSettings = {
  nodeUrls: ["http://localhost:26659"],
  stargateEnabled: true,
  denominations: ["ucosm", "ustake"],
  addressPrefix: "wasm",
  gasPrice: GasPrice.fromString("0.25ucosm"),
};

const coralnetSettings: BackendSettings = {
  nodeUrls: ["https://lcd.coralnet.cosmwasm.com"],
  stargateEnabled: false,
  denominations: ["ucosm", "ustake"],
  addressPrefix: "coral",
  gasPrice: GasPrice.fromString("0.25ucosm"),
};

const heldernetSettings: BackendSettings = {
  nodeUrls: ["https://lcd.heldernet.cosmwasm.com"],
  stargateEnabled: false,
  denominations: ["ucosm", "ustake"],
  addressPrefix: "cosmos",
  gasPrice: GasPrice.fromString("0.25ucosm"),
};

const musselnetSettings: BackendSettings = {
  nodeUrls: ["https://rpc.musselnet.cosmwasm.com"],
  stargateEnabled: true,
  denominations: ["umayo", "ufrites"],
  addressPrefix: "wasm",
  gasPrice: GasPrice.fromString("0.25ucosm"),
};

const oysternetSettings: BackendSettings = {
  nodeUrls: ["http://rpc.oysternet.cosmwasm.com"],
  stargateEnabled: true,
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

const lucinanetSettings: BackendSettings = {
  nodeUrls: ["https://rpc.juno.giansalex.dev"],
  stargateEnabled: true,
  denominations: ["ujuno"],
  addressPrefix: "juno",
  gasPrice: GasPrice.fromString("0.25ujuno"),
  keplrChainInfo: {
    rpc: "https://rpc.juno.giansalex.dev:443",
    rest: "https://lcd.juno.giansalex.dev:443",
    chainId: "lucina",
    chainName: "Juno testnet",
		stakeCurrency: {
			coinDenom: 'JUNO',
			coinMinimalDenom: 'ujuno',
			coinDecimals: 6
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
      bech32PrefixConsPub: "junovalconspub"
    },
		currencies: [
			{
				coinDenom: 'JUNO',
				coinMinimalDenom: 'ujuno',
				coinDecimals: 6
			},
		],
		feeCurrencies: [
			{
				coinDenom: 'JUNO',
				coinMinimalDenom: 'ujuno',
				coinDecimals: 6
			},
		],
		features: ["stargate", 'ibc-transfer', 'cosmwasm'],
    explorerUrlToTx: 'https://testnet.juno.aneka.io/txs/{txHash}',
	},
  
};

const knownBackends: Partial<Record<string, BackendSettings>> = {
  coralnet: coralnetSettings,
  heldernet: heldernetSettings,
  devnetStargate: devnetStargateSettings,
  musselnet: musselnetSettings,
  oysternet: oysternetSettings,
  lucinanet: lucinanetSettings 
};

export function getCurrentBackend(): BackendSettings {
  const id = process.env.REACT_APP_BACKEND || "devnetStargate";
  const backend = knownBackends[id];
  if (!backend) {
    throw new Error(`No backend found for the given ID "${id}"`);
  }
  return backend;
}
