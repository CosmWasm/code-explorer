import React from "react";

import { ClientContext } from "../contexts/ClientContext";
import { settings } from "../settings";

interface Props {}

const separatorStyle: React.CSSProperties = {
  borderColor: "rgba(255, 255, 255, 0.8)",
};
const whiteText = { color: "#f0f0f0" };

/** Place me as a row in a container */
export function FooterRow(): JSX.Element {
  const clientContext = React.useContext(ClientContext);

  const [chainId, setChainId] = React.useState<string | undefined>();

  React.useEffect(() => {
    clientContext.client.chainId().then(setChainId);
  }, [clientContext.client]);

  return (
    <div className="row">
      <div className="col">
        <hr style={separatorStyle} />
        <div style={whiteText} className="dropdown text-center font-weight-light mb-3">
          Endpoint{" "}
          <button
            className="btn btn-secondary btn-sm dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            {clientContext.nodeUrl}
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            {settings.backend.nodeUrls.map(url => (
              <button
                key={url}
                className={`dropdown-item` + (url === clientContext.nodeUrl ? " active" : "")}
                type="button"
                onClick={() => clientContext.resetClient(url)}
              >
                {url}
              </button>
            ))}
          </div>{" "}
          | Chain ID: {chainId || "Loading …"} |{" "}
          <a href="https://github.com/confio/code-explorer" style={whiteText}>
            Fork me on GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
