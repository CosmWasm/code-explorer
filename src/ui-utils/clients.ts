import {
  makeCosmoshubPath, // https://github.com/cosmos/cosmjs/issues/770
  OfflineAminoSigner,
} from "@cosmjs/amino";
import { CosmWasmFeeTable } from "@cosmjs/cosmwasm-stargate";
import {
  CosmWasmClient as StargateClient,
  SigningCosmWasmClient as StargateSigningClient,
} from "@cosmjs/cosmwasm-stargate";
import { Bip39, Random } from "@cosmjs/crypto";
import { LedgerSigner } from "@cosmjs/ledger-amino";
import { DirectSecp256k1HdWallet, OfflineDirectSigner, OfflineSigner } from "@cosmjs/proto-signing";
import { GasLimits } from "@cosmjs/stargate";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";

import { settings } from "../settings";

export { StargateClient, StargateSigningClient };

function generateMnemonic(): string {
  return Bip39.encode(Random.getBytes(16)).toString();
}

export function loadOrCreateMnemonic(mnemonic?: string): string {
  const key = "burner-wallet";
  const loaded = localStorage.getItem(key);
  if (loaded && !mnemonic) {
    return loaded;
  }
  const loadedMnemonic = mnemonic || generateMnemonic();
  localStorage.setItem(key, loadedMnemonic);
  return loadedMnemonic;
}

export type WalletLoaderAmino = (addressPrefix: string, mnemonic?: string) => Promise<OfflineAminoSigner>;
export type WalletLoaderDirect = (addressPrefix: string, mnemonic?: string) => Promise<OfflineDirectSigner>;

export async function loadOrCreateWalletDirect(
  addressPrefix: string,
  mnemonic?: string,
): Promise<OfflineDirectSigner> {
  const loadedMnemonic = loadOrCreateMnemonic(mnemonic);
  const hdPath = makeCosmoshubPath(0);
  return DirectSecp256k1HdWallet.fromMnemonic(loadedMnemonic, { hdPaths: [hdPath], prefix: addressPrefix });
}

export async function loadLedgerWallet(addressPrefix: string): Promise<OfflineAminoSigner> {
  const interactiveTimeout = 120_000;
  const ledgerTransport = await TransportWebUSB.create(interactiveTimeout, interactiveTimeout);

  return new LedgerSigner(ledgerTransport, { hdPaths: [makeCosmoshubPath(0)], prefix: addressPrefix });
}

async function createStargateSigningClient(signer: OfflineSigner): Promise<StargateSigningClient> {
  const { nodeUrls, gasPrice } = settings.backend;
  const endpoint = nodeUrls[0];

  const gasLimits: Partial<GasLimits<CosmWasmFeeTable>> = {
    upload: 1500000,
    init: 600000,
    exec: 400000,
    migrate: 600000,
    send: 80000,
    changeAdmin: 80000,
  };

  return StargateSigningClient.connectWithSigner(endpoint, signer, {
    gasPrice: gasPrice,
    gasLimits: gasLimits,
  });
}

export async function getAddressAndStargateSigningClient(
  loadWallet: WalletLoaderDirect | WalletLoaderAmino,
  mnemonic?: string,
): Promise<[string, StargateSigningClient]> {
  const signer = await loadWallet(settings.backend.addressPrefix, mnemonic);
  const userAddress = (await signer.getAccounts())[0].address;
  const signingClient = await createStargateSigningClient(signer);
  return [userAddress, signingClient];
}

export function webUsbMissing(): boolean {
  const anyNavigator: any = navigator;
  return !anyNavigator?.usb;
}
