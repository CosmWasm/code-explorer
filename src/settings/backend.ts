export type NonEmptyArray<ElementType> = { readonly 0: ElementType } & readonly ElementType[];

export interface BackendSettings {
  readonly nodeUrls: NonEmptyArray<string>;
}

const coralnetSettings: BackendSettings = {
  nodeUrls: ["https://lcd.coralnet.cosmwasm.com"],
};

const devnetSettings: BackendSettings = {
  nodeUrls: ["http://localhost:1317"],
};

const regenSettings: BackendSettings = {
  nodeUrls: ["https://regen-lcd.vitwit.com", "https://regen-relay.01node.com"],
};

const knownBackends: { [index: string]: BackendSettings } = {
  devnet: devnetSettings,
  coralnet: coralnetSettings,
  regen: regenSettings,
};

export function getCurrentBackend(): BackendSettings {
  return knownBackends[process.env.REACT_APP_BACKEND || "devnet"];
}
