import "./App.css";

import React from "react";

import logo from "./logo.svg";

interface Codes {
  readonly ids: number[];
}

const CodesContext = React.createContext<Codes>({ ids: [] });

function App(): JSX.Element {
  const codes: Codes = { ids: [] };

  return (
    <CodesContext.Provider value={codes}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
            Learn React
          </a>
        </header>
      </div>
    </CodesContext.Provider>
  );
}

export default App;
