import { CosmWasmClient as LaunchpadClient, CosmWasmFeeTable, SigningCosmWasmClient } from "@cosmjs/cosmwasm";
import { CosmWasmClient as StargateClient } from "@cosmjs/cosmwasm-stargate";
import { Bip39, Random } from "@cosmjs/crypto";
import { GasLimits, GasPrice, makeCosmoshubPath, OfflineSigner, Secp256k1HdWallet } from "@cosmjs/launchpad";
import { LedgerSigner } from "@cosmjs/launchpad-ledger";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";

import { settings } from "../settings";

export { LaunchpadClient, StargateClient };

export function isStargateClient(client: LaunchpadClient | StargateClient | null): client is StargateClient {
  return client instanceof StargateClient;
}

export function isLaunchpadClient(
  client: LaunchpadClient | StargateClient | null,
): client is LaunchpadClient {
  return client instanceof LaunchpadClient;
}

export function generateMnemonic(): string {
  return Bip39.encode(Random.getBytes(16)).toString();
}

export function loadOrCreateMnemonic(): string {
  const key = "burner-wallet";
  const loaded = localStorage.getItem(key);
  if (loaded) {
    return loaded;
  }
  const generated = generateMnemonic();
  localStorage.setItem(key, generated);
  return generated;
}

export type WalletLoader = (addressPrefix: string) => Promise<OfflineSigner>;

export async function loadOrCreateWallet(addressPrefix: string): Promise<OfflineSigner> {
  const mnemonic = loadOrCreateMnemonic();
  const hdPath = makeCosmoshubPath(0);
  const wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, hdPath, addressPrefix);
  return wallet;
}

export async function loadLedgerWallet(addressPrefix: string): Promise<OfflineSigner> {
  const interactiveTimeout = 120_000;
  const ledgerTransport = await TransportWebUSB.create(interactiveTimeout, interactiveTimeout);

  return new LedgerSigner(ledgerTransport, { hdPaths: [makeCosmoshubPath(0)], prefix: addressPrefix });
}

export async function createClient(signer: OfflineSigner): Promise<SigningCosmWasmClient> {
  const { denominations, nodeUrls } = settings.backend;
  const feeToken = denominations[0];
  const apiUrl = nodeUrls[0];

  const firstAddress = (await signer.getAccounts())[0].address;
  const gasPrice = GasPrice.fromString(`${0.025}${feeToken}`);
  const gasLimits: GasLimits<CosmWasmFeeTable> = {
    upload: 1500000,
    init: 600000,
    exec: 400000,
    migrate: 600000,
    send: 80000,
    changeAdmin: 80000,
  };

  return new SigningCosmWasmClient(apiUrl, firstAddress, signer, gasPrice, gasLimits);
}

export async function getSigningClient(loadWallet: WalletLoader): Promise<SigningCosmWasmClient> {
  const signer = await loadWallet(settings.backend.addressPrefix);
  const client = await createClient(signer);
  return client;
}

export function disableLedgerLogin(): any {
  const anyNavigator: any = navigator;
  return !anyNavigator?.usb;
}
