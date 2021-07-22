import {
  CosmWasmClient as LaunchpadClient,
  CosmWasmFeeTable,
  SigningCosmWasmClient as LaunchpadSigningClient,
} from "@cosmjs/cosmwasm-launchpad";
import {
  codec,
  CosmWasmClient as StargateClient,
  SigningCosmWasmClient as StargateSigningClient,
} from "@cosmjs/cosmwasm-stargate";
import { Bip39, Random } from "@cosmjs/crypto";
import {
  GasLimits,
  makeCosmoshubPath,
  OfflineSigner as OfflineAminoSigner,
  Secp256k1HdWallet,
} from "@cosmjs/launchpad";

import { DirectSecp256k1HdWallet, OfflineDirectSigner, OfflineSigner, Registry } from "@cosmjs/proto-signing";

import { settings } from "../settings";
import { msgExecuteContractTypeUrl, msgInstantiateContractTypeUrl, msgStoreCodeTypeUrl } from "./txs";

export { LaunchpadClient, StargateClient, LaunchpadSigningClient, StargateSigningClient };

export function isStargateClient(client: LaunchpadClient | StargateClient | null): client is StargateClient {
  return client instanceof StargateClient;
}

export function isLaunchpadClient(
  client: LaunchpadClient | StargateClient | null,
): client is LaunchpadClient {
  return client instanceof LaunchpadClient;
}

export function isStargateSigningClient(
  signingClient: LaunchpadSigningClient | StargateSigningClient | null,
): signingClient is StargateSigningClient {
  return signingClient instanceof StargateSigningClient;
}

export function isLaunchpadSigningClient(
  signingClient: LaunchpadClient | StargateClient | null,
): signingClient is LaunchpadSigningClient {
  return signingClient instanceof LaunchpadSigningClient;
}

export function generateMnemonic(): string {
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

export async function loadOrCreateWalletAmino(
  addressPrefix: string,
  mnemonic?: string,
): Promise<OfflineAminoSigner> {
  const loadedMnemonic = loadOrCreateMnemonic(mnemonic);
  const hdPath = makeCosmoshubPath(0);
  return Secp256k1HdWallet.fromMnemonic(loadedMnemonic, hdPath, addressPrefix);
}

export async function loadOrCreateWalletDirect(
  addressPrefix: string,
  mnemonic?: string,
): Promise<OfflineDirectSigner> {
  const loadedMnemonic = loadOrCreateMnemonic(mnemonic);
  const hdPath = makeCosmoshubPath(0);
  return DirectSecp256k1HdWallet.fromMnemonic(loadedMnemonic, hdPath, addressPrefix);
}

async function createLaunchpadSigningClient(signer: OfflineAminoSigner): Promise<LaunchpadSigningClient> {
  const { nodeUrls, gasPrice } = settings.backend;
  const apiUrl = nodeUrls[0];

  const firstAddress = (await signer.getAccounts())[0].address;
  const gasLimits: GasLimits<CosmWasmFeeTable> = {
    upload: 1500000,
    init: 600000,
    exec: 400000,
    migrate: 600000,
    send: 80000,
    changeAdmin: 80000,
  };

  return new LaunchpadSigningClient(apiUrl, firstAddress, signer, gasPrice, gasLimits);
}

async function createStargateSigningClient(signer: OfflineSigner): Promise<StargateSigningClient> {
  const { nodeUrls, gasPrice } = settings.backend;
  const endpoint = nodeUrls[0];

  const { MsgStoreCode, MsgInstantiateContract, MsgExecuteContract } = codec.cosmwasm.wasm.v1beta1;
  const typeRegistry = new Registry([
    [msgStoreCodeTypeUrl, MsgStoreCode],
    [msgInstantiateContractTypeUrl, MsgInstantiateContract],
    [msgExecuteContractTypeUrl, MsgExecuteContract],
  ]);

  const gasLimits: GasLimits<CosmWasmFeeTable> = {
    upload: 1500000,
    init: 600000,
    exec: 400000,
    migrate: 600000,
    send: 80000,
    changeAdmin: 80000,
  };

  return StargateSigningClient.connectWithSigner(endpoint, signer, {
    registry: typeRegistry,
    gasPrice: gasPrice,
    gasLimits: gasLimits,
  });
}

export async function getAddressAndLaunchpadSigningClient(
  loadWallet: WalletLoaderAmino,
  mnemonic?: string,
): Promise<[string, LaunchpadSigningClient]> {
  const signer = await loadWallet(settings.backend.addressPrefix, mnemonic);
  const userAddress = (await signer.getAccounts())[0].address;
  const signingClient = await createLaunchpadSigningClient(signer);
  return [userAddress, signingClient];
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
