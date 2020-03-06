import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import React from "react";
import ReactDOM from "react-dom";
import { Route, Switch } from "react-router-dom";

import { FlexibleRouter } from "./components/FlexibleRouter";
import CodePage from "./pages/code/CodePage";
import CodeslistPage from "./pages/codeslist/CodeslistPage";
import ContractPage from "./pages/contract/ContractPage";
import { settings } from "./settings";

ReactDOM.render(
  <FlexibleRouter type={settings.deployment.routerType}>
    <Switch>
      <Route path="/codes/:codeId" component={CodePage} />
      <Route path="/contracts/:contractAddress" component={ContractPage} />
      <Route component={() => <CodeslistPage />} />
    </Switch>
  </FlexibleRouter>,
  document.getElementById("root"),
);
