export type NonEmptyArray<ElementType> = { readonly 0: ElementType } & readonly ElementType[];

export interface BackendSettings {
  readonly nodeUrls: NonEmptyArray<string>;
  readonly stargateEnabled: boolean;
  readonly denominations: readonly string[];
}

const devnetStargateSettings: BackendSettings = {
  nodeUrls: ["http://localhost:26659"],
  stargateEnabled: true,
  denominations: ["ucosm", "ustake"],
};

const devnetLaunchpadSettings: BackendSettings = {
  nodeUrls: ["http://localhost:1317"],
  stargateEnabled: false,
  denominations: ["ucosm", "ustake"],
};

const coralnetSettings: BackendSettings = {
  nodeUrls: ["https://lcd.coralnet.cosmwasm.com"],
  stargateEnabled: false,
  denominations: ["ucosm", "ustake"],
};

const heldernetSettings: BackendSettings = {
  nodeUrls: ["https://lcd.heldernet.cosmwasm.com"],
  stargateEnabled: false,
  denominations: ["ucosm", "ustake"],
};

const regenSettings: BackendSettings = {
  nodeUrls: ["https://regen-lcd.vitwit.com", "https://regen-relay.01node.com"],
  stargateEnabled: false,
  denominations: ["ucosm", "ustake"],
};

const knownBackends: { [index: string]: BackendSettings } = {
  coralnet: coralnetSettings,
  heldernet: heldernetSettings,
  devnetLaunchpad: devnetLaunchpadSettings,
  devnetStargate: devnetStargateSettings,
  regen: regenSettings,
};

export function getCurrentBackend(): BackendSettings {
  const id = process.env.REACT_APP_BACKEND || "devnetLaunchpad";
  return knownBackends[id];
}
