import React, { Fragment } from "react";

import { ClientContext } from "../contexts/ClientContext";
import { settings } from "../settings";
import { EndpointSelector } from "./EndpointSelector";
import { NodeInfoModal } from "./NodeInfoModal";

interface Props {}

const hrStyle: React.CSSProperties = {
  borderColor: "rgba(255, 255, 255, 0.8)",
};
const whiteText = { color: "#f0f0f0" };

function Separator(): JSX.Element {
  return <Fragment> | </Fragment>;
}

/** Place me as a row in a container */
export function FooterRow(): JSX.Element {
  const clientContext = React.useContext(ClientContext);

  const [chainId, setChainId] = React.useState<string | "error" | "loading">("loading");
  const [height, setHeight] = React.useState<number | "error" | "loading">("loading");

  const updateHeight = React.useCallback(() => {
    clientContext.client
      .getHeight()
      .then(setHeight)
      .catch(() => setChainId("error"));
  }, [clientContext.client]);

  React.useEffect(() => {
    clientContext.client
      .getChainId()
      .then(setChainId)
      .catch(() => setChainId("error"));
    updateHeight();
  }, [clientContext.client, updateHeight]);

  return (
    <div className="row">
      <div className="col">
        <hr style={hrStyle} />
        <NodeInfoModal htmlId="nodeInfoModal" chainId={chainId} height={height} />
        <div style={whiteText} className="dropdown text-center font-weight-light mb-3">
          Endpoint{" "}
          <EndpointSelector
            currentUrl={clientContext.nodeUrl}
            urls={settings.backend.nodeUrls}
            urlChanged={newUrl => clientContext.resetClient(newUrl)}
          />{" "}
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            data-toggle="modal"
            data-target="#nodeInfoModal"
            onClick={updateHeight}
          >
            Node info
          </button>
          <Separator />
          <a href="https://github.com/CosmWasm/code-explorer" style={whiteText}>
            Fork me on GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
