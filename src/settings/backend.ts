export type NonEmptyArray<ElementType> = { readonly 0: ElementType } & readonly ElementType[];

export interface BackendSettings {
  readonly nodeUrls: NonEmptyArray<string>;
}

const demonetSettings: BackendSettings = {
  nodeUrls: ["https://lcd.demo-08.cosmwasm.com"],
};

const devnetSettings: BackendSettings = {
  nodeUrls: ["http://localhost:1317"],
};

const regenSettings: BackendSettings = {
  nodeUrls: ["https://regen-lcd.vitwit.com", "https://regen-relay.01node.com"],
};

const knownBackends: { [index: string]: BackendSettings } = {
  devnet: devnetSettings,
  demonet: demonetSettings,
  regen: regenSettings,
};

export function getCurrentBackend(): BackendSettings {
  return knownBackends[process.env.REACT_APP_BACKEND || "devnet"];
}
