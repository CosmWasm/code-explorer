import React from "react";
import { Redirect, Route, Switch } from "react-router";

import { ClientContext, ClientContextValue } from "../contexts/ClientContext";
import { AccountPage } from "../pages/account/AccountPage";
import { CodePage } from "../pages/code/CodePage";
import { CodesPage } from "../pages/codes/CodesPage";
import { ContractPage } from "../pages/contract/ContractPage";
import { TxPage } from "../pages/tx/TxPage";
import { settings } from "../settings";
import { StargateClient, StargateSigningClient } from "../ui-utils/clients";
import { FlexibleRouter } from "./FlexibleRouter";

const { nodeUrls } = settings.backend;

export function App(): JSX.Element {
  const [nodeUrl, setNodeUrl] = React.useState(nodeUrls[0]);
  const [userAddress, setUserAddress] = React.useState<string>();
  const [signingClient, setSigningClient] = React.useState<StargateSigningClient>();
  const [contextValue, setContextValue] = React.useState<ClientContextValue>({
    nodeUrl: nodeUrl,
    client: null,
    resetClient: setNodeUrl,
    userAddress: userAddress,
    setUserAddress: setUserAddress,
    signingClient: signingClient,
    setSigningClient: setSigningClient,
  });

  React.useEffect(() => {
    (async function updateContextValue() {
      const client = await StargateClient.connect(nodeUrl);
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
