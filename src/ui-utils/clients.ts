import { CosmWasmFeeTable } from "@cosmjs/cosmwasm-launchpad";
import {
  codec,
  CosmWasmClient as StargateClient,
  SigningCosmWasmClient as StargateSigningClient,
} from "@cosmjs/cosmwasm-stargate";
import { Bip39, Random } from "@cosmjs/crypto";
import { GasLimits, makeCosmoshubPath, OfflineSigner as OfflineAminoSigner } from "@cosmjs/launchpad";
import { LedgerSigner } from "@cosmjs/launchpad-ledger";
import { DirectSecp256k1HdWallet, OfflineDirectSigner, OfflineSigner, Registry } from "@cosmjs/proto-signing";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";

import { settings } from "../settings";
import { msgExecuteContractTypeUrl, msgInstantiateContractTypeUrl, msgStoreCodeTypeUrl } from "./txs";

export { StargateClient, StargateSigningClient };

export function isStargateClient(client: StargateClient | null): client is StargateClient {
  return client instanceof StargateClient;
}

export function isStargateSigningClient(
  signingClient: StargateSigningClient | null,
): signingClient is StargateSigningClient {
  return signingClient instanceof StargateSigningClient;
}

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
  return DirectSecp256k1HdWallet.fromMnemonic(loadedMnemonic, hdPath, addressPrefix);
}

export async function loadLedgerWallet(addressPrefix: string): Promise<OfflineAminoSigner> {
  const interactiveTimeout = 120_000;
  const ledgerTransport = await TransportWebUSB.create(interactiveTimeout, interactiveTimeout);

  return new LedgerSigner(ledgerTransport, { hdPaths: [makeCosmoshubPath(0)], prefix: addressPrefix });
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
