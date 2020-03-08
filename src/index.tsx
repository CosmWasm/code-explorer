import "jquery/dist/jquery.slim";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "./index.css";

import React from "react";
import ReactDOM from "react-dom";
import { Redirect, Route, Switch } from "react-router-dom";

import { FlexibleRouter } from "./components/FlexibleRouter";
import { AccountPage } from "./pages/account/AccountPage";
import { CodePage } from "./pages/code/CodePage";
import { CodesPage } from "./pages/codes/CodesPage";
import { ContractPage } from "./pages/contract/ContractPage";
import { TxPage } from "./pages/tx/TxPage";
import { settings } from "./settings";

ReactDOM.render(
  <FlexibleRouter type={settings.deployment.routerType}>
    <Switch>
      <Route exact path="/codes" component={CodesPage} />
      <Route path="/codes/:codeId" component={CodePage} />
      <Route path="/contracts/:contractAddress" component={ContractPage} />
      <Route path="/transactions/:txId" component={TxPage} />
      <Route path="/accounts/:address" component={AccountPage} />
      <Route component={() => <Redirect to="/codes" />} />
    </Switch>
  </FlexibleRouter>,
  document.getElementById("root"),
);
