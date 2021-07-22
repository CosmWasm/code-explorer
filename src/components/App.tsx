import { MsgExecuteContract, MsgInstantiateContract, MsgStoreCode } from "@cosmjs/cosmwasm-stargate/build/codec/cosmwasm/wasm/v1beta1/tx";
import { Registry } from "@cosmjs/proto-signing";
import React from "react";
import { Redirect, Route, Switch } from "react-router";

import { ClientContext, ClientContextValue } from "../contexts/ClientContext";
import { AccountPage } from "../pages/account/AccountPage";
import { CodePage } from "../pages/code/CodePage";
import { CodesPage } from "../pages/codes/CodesPage";
import { ContractPage } from "../pages/contract/ContractPage";
import { TxPage } from "../pages/tx/TxPage";
import { settings } from "../settings";
import {
  LaunchpadClient,
  LaunchpadSigningClient,
  StargateClient,
  StargateSigningClient,
} from "../ui-utils/clients";
import {
  msgExecuteContractTypeUrl,
  msgInstantiateContractTypeUrl,
  msgStoreCodeTypeUrl,
} from "../ui-utils/txs";
import { FlexibleRouter } from "./FlexibleRouter";

const { nodeUrls, stargateEnabled } = settings.backend;
const typeRegistry = new Registry([
  [msgStoreCodeTypeUrl, MsgStoreCode],
  [msgInstantiateContractTypeUrl, MsgInstantiateContract],
  [msgExecuteContractTypeUrl, MsgExecuteContract],
]);

export function App(): JSX.Element {
  const [nodeUrl, setNodeUrl] = React.useState(nodeUrls[0]);
  const [userAddress, setUserAddress] = React.useState<string>();
  const [signingClient, setSigningClient] = React.useState<LaunchpadSigningClient | StargateSigningClient>();
  const [contextValue, setContextValue] = React.useState<ClientContextValue>({
    nodeUrl: nodeUrl,
    client: null,
    typeRegistry: typeRegistry,
    resetClient: setNodeUrl,
    userAddress: userAddress,
    setUserAddress: setUserAddress,
    signingClient: signingClient,
    setSigningClient: setSigningClient,
  });

  React.useEffect(() => {
    (async function updateContextValue() {
      const client = stargateEnabled ? await StargateClient.connect(nodeUrl) : new LaunchpadClient(nodeUrl);
      setContextValue((prevContextValue) => ({ ...prevContextValue, nodeUrl: nodeUrl, client: client }));
    })();
  }, [nodeUrl]);

  React.useEffect(() => {
    setContextValue((prevContextValue) => ({ ...prevContextValue, signingClient: signingClient }));
  }, [signingClient]);

  React.useEffect(() => {
    setContextValue((prevContextValue) => ({ ...prevContextValue, userAddress: userAddress }));
  }, [userAddress]);

  return (
    <ClientContext.Provider value={contextValue}>
      <FlexibleRouter type={settings.deployment.routerType}>
        <Switch>
          <Route exact path="/codes" component={CodesPage} />
          <Route path="/codes/:codeId" component={CodePage} />
          <Route path="/contracts/:contractAddress" component={ContractPage} />
          <Route path="/transactions/:txId" component={TxPage} />
          <Route path="/accounts/:address" component={AccountPage} />
          <Route component={() => <Redirect to="/codes" />} />
        </Switch>
      </FlexibleRouter>
    </ClientContext.Provider>
  );
}
