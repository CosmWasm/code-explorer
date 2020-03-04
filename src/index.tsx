import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import React from "react";
import ReactDOM from "react-dom";
import { Route, Switch } from "react-router-dom";

import CodePage from "./code/CodePage";
import CodeslistPage from "./codeslist/CodeslistPage";
import { FlexibleRouter } from "./components/FlexibleRouter";
import ContractPage from "./contract/ContractPage";
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
