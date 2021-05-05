import React from "react";

import { StargateClient, StargateSigningClient } from "../ui-utils/clients";

export interface ClientContextValue {
  readonly nodeUrl: string;
  readonly client: StargateClient | null;
  readonly resetClient: (nodeUrl: string) => void;
  readonly userAddress?: string;
  readonly setUserAddress: (newUserAddress?: string) => void;
  readonly signingClient?: StargateSigningClient;
  readonly setSigningClient: (newSigningClient?: StargateSigningClient) => void;
}

/**
 * "only used when a component does not have a matching Provider above it in the tree"
 *
 * @see https://reactjs.org/docs/context.html#reactcreatecontext
 */
const dummyContext: ClientContextValue = {
  nodeUrl: "",
  client: null,
  resetClient: () => {},
  setUserAddress: () => {},
  setSigningClient: () => {},
};

export const ClientContext = React.createContext<ClientContextValue>(dummyContext);
