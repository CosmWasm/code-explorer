export type NonEmptyArray<ElementType> = { readonly 0: ElementType } & readonly ElementType[];

export interface BackendSettings {
  readonly nodeUrls: NonEmptyArray<string>;
  readonly stargateEnabled: boolean;
}

const devnetStargateSettings: BackendSettings = {
  nodeUrls: [`http://localhost:26659`],
  stargateEnabled: true,
};

const devnetLaunchpadSettings: BackendSettings = {
  nodeUrls: [`http://localhost:1317`],
  stargateEnabled: false,
};

const coralnetSettings: BackendSettings = {
  nodeUrls: ["https://lcd.coralnet.cosmwasm.com"],
  stargateEnabled: false,
};

const heldernetSettings: BackendSettings = {
  nodeUrls: ["https://lcd.heldernet.cosmwasm.com"],
  stargateEnabled: false,
};

const regenSettings: BackendSettings = {
  nodeUrls: ["https://regen-lcd.vitwit.com", "https://regen-relay.01node.com"],
  stargateEnabled: false,
};

const knownBackends: { [index: string]: BackendSettings } = {
  coralnet: coralnetSettings,
  heldernet: heldernetSettings,
  devnetLaunchpad: devnetLaunchpadSettings,
  devnetStargate: devnetStargateSettings,
  regen: regenSettings,
};

export function getCurrentBackend(): BackendSettings {
  return knownBackends[
    process.env.REACT_APP_BACKEND || process.env.REACT_APP_STARGATE ? "devnetStargate" : "devnetLaunchpad"
  ];
}
