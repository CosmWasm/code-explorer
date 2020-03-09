import { CosmWasmClient } from "@cosmwasm/sdk";
import React from "react";

export interface ClientContextValue {
  readonly nodeUrl: string;
  readonly client: CosmWasmClient;
  readonly resetClient: (nodeUrl: string) => void;
}

/**
 * "only used when a component does not have a matching Provider above it in the tree"
 *
 * @see https://reactjs.org/docs/context.html#reactcreatecontext
 */
const dummyContext: ClientContextValue = {
  nodeUrl: "",
  client: new CosmWasmClient(""),
  resetClient: () => {},
};

export const ClientContext = React.createContext<ClientContextValue>(dummyContext);
