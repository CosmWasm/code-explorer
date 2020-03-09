import { CosmWasmClient } from "@cosmwasm/sdk";
import React from "react";
import { Redirect, Route, Switch } from "react-router";

import { ClientContext, ClientContextValue } from "../contexts/ClientContext";
import { AccountPage } from "../pages/account/AccountPage";
import { CodePage } from "../pages/code/CodePage";
import { CodesPage } from "../pages/codes/CodesPage";
import { ContractPage } from "../pages/contract/ContractPage";
import { TxPage } from "../pages/tx/TxPage";
import { settings } from "../settings";
import { FlexibleRouter } from "./FlexibleRouter";

export function App(): JSX.Element {
  const [nodeUrl, setNodeUrl] = React.useState<string>(settings.backend.nodeUrl);
  const [client, setClient] = React.useState<CosmWasmClient>(new CosmWasmClient(nodeUrl));

  const contextValue: ClientContextValue = {
    nodeUrl: nodeUrl,
    client: client,
    resetClient: newUrl => {
      setNodeUrl(newUrl);
      setClient(new CosmWasmClient(newUrl));
    },
  };

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
