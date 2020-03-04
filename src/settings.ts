export interface Settings {
  readonly nodeUrl: string;
}

const demonetSettings: Settings = {
  nodeUrl: "https://lcd.demo-07.cosmwasm.com",
};

const devnetSettings: Settings = {
  nodeUrl: "http://localhost:1317",
};

export const settings = process.env.NODE_ENV === "development" ? devnetSettings : demonetSettings;
