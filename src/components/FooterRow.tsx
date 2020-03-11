import React, { Fragment } from "react";

import { ClientContext } from "../contexts/ClientContext";
import { settings } from "../settings";
import { EndpointSelector } from "./EndpointSelector";

interface Props {}

const separatorStyle: React.CSSProperties = {
  borderColor: "rgba(255, 255, 255, 0.8)",
};
const whiteText = { color: "#f0f0f0" };

function joinJsxElements(elements: readonly JSX.Element[], separator: JSX.Element): readonly JSX.Element[] {
  return elements.reduce((accumulator: readonly JSX.Element[], element) => {
    return accumulator.length === 0 ? [element] : [...accumulator, separator, element];
  }, []);
}

/** Place me as a row in a container */
export function FooterRow(): JSX.Element {
  const clientContext = React.useContext(ClientContext);

  const [chainId, setChainId] = React.useState<string | "error" | "loading">("loading");

  React.useEffect(() => {
    clientContext.client
      .getChainId()
      .then(setChainId)
      .catch(() => setChainId("error"));
  }, [clientContext.client]);

  const footerElements: readonly JSX.Element[] = [
    <Fragment>
      Endpoint{" "}
      <EndpointSelector
        currentUrl={clientContext.nodeUrl}
        urls={settings.backend.nodeUrls}
        urlChanged={newUrl => clientContext.resetClient(newUrl)}
      />
    </Fragment>,
    <Fragment>
      Chain ID: {chainId === "loading" ? "Loading …" : chainId === "error" ? "Error" : chainId}
    </Fragment>,
    <a href="https://github.com/confio/code-explorer" style={whiteText}>
      Fork me on GitHub
    </a>,
  ];

  return (
    <div className="row">
      <div className="col">
        <hr style={separatorStyle} />
        <div style={whiteText} className="dropdown text-center font-weight-light mb-3">
          {joinJsxElements(footerElements, <Fragment> | </Fragment>)}
        </div>
      </div>
    </div>
  );
}
