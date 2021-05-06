import { GasPrice } from "@cosmjs/stargate";

export type NonEmptyArray<ElementType> = { readonly 0: ElementType } & readonly ElementType[];

export interface BackendSettings {
  readonly nodeUrls: NonEmptyArray<string>;
  readonly denominations: readonly string[];
  readonly addressPrefix: string;
  readonly gasPrice: GasPrice;
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

const knownBackends: Partial<Record<string, BackendSettings>> = {
  devnetStargate: devnetStargateSettings,
  musselnet: musselnetSettings,
};

export function getCurrentBackend(): BackendSettings {
  const id = process.env.REACT_APP_BACKEND || "devnetStargate";
  const backend = knownBackends[id];
  if (!backend) {
    throw new Error(`No backend found for the given ID "${id}"`);
  }
  return backend;
}
