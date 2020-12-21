import { SigningCosmWasmClient } from "@cosmjs/cosmwasm";
import { Registry } from "@cosmjs/proto-signing";
import React from "react";

import { LaunchpadClient, StargateClient } from "../ui-utils/clients";

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
  typeRegistry: new Registry(),
  resetClient: () => {},
  setSigningClient: () => {},
};

export const ClientContext = React.createContext<ClientContextValue>(dummyContext);
