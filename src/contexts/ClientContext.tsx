import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-launchpad";
import { codec } from "@cosmjs/cosmwasm-stargate";
import { Registry } from "@cosmjs/proto-signing";
import React from "react";

import { LaunchpadClient, StargateClient } from "../ui-utils/clients";
import {
  msgExecuteContractTypeUrl,
  msgInstantiateContractTypeUrl,
  msgStoreCodeTypeUrl,
} from "../ui-utils/txs";

const { MsgExecuteContract, MsgInstantiateContract, MsgStoreCode } = codec.cosmwasm.wasm.v1beta1;

export interface ClientContextValue {
  readonly nodeUrl: string;
  readonly client: LaunchpadClient | StargateClient | null;
  readonly typeRegistry: Registry;
  readonly resetClient: (nodeUrl: string) => void;
  readonly signingClient?: SigningCosmWasmClient;
  readonly setSigningClient: (newSigningClient?: SigningCosmWasmClient) => void;
}

/**
 * "only used when a component does not have a matching Provider above it in the tree"
 *
 * @see https://reactjs.org/docs/context.html#reactcreatecontext
 */
const dummyContext: ClientContextValue = {
  nodeUrl: "",
  client: null,
  typeRegistry: new Registry([
    [msgStoreCodeTypeUrl, MsgStoreCode],
    [msgInstantiateContractTypeUrl, MsgInstantiateContract],
    [msgExecuteContractTypeUrl, MsgExecuteContract],
  ]),
  resetClient: () => {},
  setSigningClient: () => {},
};

export const ClientContext = React.createContext<ClientContextValue>(dummyContext);
