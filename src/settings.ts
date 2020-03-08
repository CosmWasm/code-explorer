/* eslint-disable @typescript-eslint/no-unused-vars */

export interface BackendSettings {
  readonly nodeUrl: string;
}

export interface DeploymentSettings {
  readonly routerType: "browser-router" | "hash-router";
}

export interface Settings {
  /** Where do we connect to */
  readonly backend: BackendSettings;
  /** How are we hosted */
  readonly deployment: DeploymentSettings;
}

const demonetSettings: BackendSettings = {
  nodeUrl: "https://lcd.demo-07.cosmwasm.com",
};

const devnetSettings: BackendSettings = {
  nodeUrl: "http://localhost:1317",
};

const developmentServer: DeploymentSettings = {
  routerType: "browser-router",
};

const ghPages: DeploymentSettings = {
  routerType: "hash-router",
};

const firebaseHosting: DeploymentSettings = {
  routerType: "browser-router",
};

const knownBackends: { [index: string]: BackendSettings } = {
  devnet: devnetSettings,
  demonet: demonetSettings,
};

export const settings: Settings = {
  backend: knownBackends[process.env.REACT_APP_BACKEND || "devnet"],
  deployment: process.env.NODE_ENV === "production" ? ghPages : developmentServer,
};
