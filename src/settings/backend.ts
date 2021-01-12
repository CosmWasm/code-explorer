import { GasPrice } from "@cosmjs/launchpad";

export type NonEmptyArray<ElementType> = { readonly 0: ElementType } & readonly ElementType[];

export interface BackendSettings {
  readonly nodeUrls: NonEmptyArray<string>;
  readonly stargateEnabled: boolean;
  readonly denominations: readonly string[];
  readonly addressPrefix: string;
  readonly gasPrice: GasPrice;
}

const devnetStargateSettings: BackendSettings = {
  nodeUrls: ["http://localhost:26659"],
  stargateEnabled: true,
  denominations: ["ucosm", "ustake"],
  addressPrefix: "wasm",
  gasPrice: GasPrice.fromString("0.25ucosm"),
};

const devnetLaunchpadSettings: BackendSettings = {
  nodeUrls: ["http://localhost:1317"],
  stargateEnabled: false,
  denominations: ["ucosm", "ustake"],
  addressPrefix: "cosmos",
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

const knownBackends: Partial<Record<string, BackendSettings>> = {
  coralnet: coralnetSettings,
  heldernet: heldernetSettings,
  devnetLaunchpad: devnetLaunchpadSettings,
  devnetStargate: devnetStargateSettings,
};

export function getCurrentBackend(): BackendSettings {
  const id = process.env.REACT_APP_BACKEND || "devnetLaunchpad";
  const backend = knownBackends[id];
  if (!backend) {
    throw new Error(`No backend found for the given ID "${id}"`);
  }
  return backend;
}
