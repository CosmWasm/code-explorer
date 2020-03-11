import React from "react";

import { ClientContext } from "../contexts/ClientContext";
import { settings } from "../settings";
import { EndpointSelector } from "./EndpointSelector";

interface Props {}

const separatorStyle: React.CSSProperties = {
  borderColor: "rgba(255, 255, 255, 0.8)",
};
const whiteText = { color: "#f0f0f0" };

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

  return (
    <div className="row">
      <div className="col">
        <hr style={separatorStyle} />
        <div style={whiteText} className="dropdown text-center font-weight-light mb-3">
          Endpoint{" "}
          <EndpointSelector
            currentUrl={clientContext.nodeUrl}
            urls={settings.backend.nodeUrls}
            urlChanged={newUrl => clientContext.resetClient(newUrl)}
          />{" "}
          | Chain ID: {chainId === "loading" ? "Loading …" : chainId === "error" ? "Error" : chainId} |{" "}
          <a href="https://github.com/confio/code-explorer" style={whiteText}>
            Fork me on GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
