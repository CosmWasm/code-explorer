import "bootstrap/dist/css/bootstrap.min.css";

import React from "react";

import { Codes } from "./codeslist/Codes";

function App(): JSX.Element {
  return (
    <div className="container">
      <Codes />
    </div>
  );
}

export default App;
