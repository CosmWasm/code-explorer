import React from "react";

import { ClientContext } from "../contexts/ClientContext";

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
        <p style={whiteText} className="text-center font-weight-light">
          Connected to endpoint {clientContext.nodeUrl} ({chainId || "Loading …"}) |{" "}
          <a href="https://github.com/confio/code-explorer" style={whiteText}>
            Fork me on GitHub
          </a>
        </p>
      </div>
    </div>
  );
}
