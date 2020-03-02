import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import CodePage from "./code/CodePage";
import CodeslistPage from "./codeslist/CodeslistPage";
import ContractPage from "./contract/ContractPage";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route path="/codes/:codeId" component={CodePage} />
      <Route path="/contracts/:contractAddress" component={ContractPage} />
      <Route component={() => <CodeslistPage />} />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root"),
);
