import { CosmWasmClient } from "@cosmwasm/sdk";
import React from "react";

import { BackendSettings } from "../settings";

interface Props {
  readonly backend: BackendSettings;
}

const separatorStyle: React.CSSProperties = {
  borderColor: "rgba(255, 255, 255, 0.8)",
};
const whiteText = { color: "#f0f0f0" };

/** Place me as a row in a container */
export function FooterRow({ backend }: Props): JSX.Element {
  const [chainId, setChainId] = React.useState<string | undefined>();

  React.useEffect(() => {
    const client = new CosmWasmClient(backend.nodeUrl);
    client.chainId().then(setChainId);
  }, [backend.nodeUrl]);

  return (
    <div className="row">
      <div className="col">
        <hr style={separatorStyle} />
        <p style={whiteText} className="text-center font-weight-light">
          Connected to endpoint {backend.nodeUrl} ({chainId || "Loading …"}) |{" "}
          <a href="https://github.com/confio/code-explorer" style={whiteText}>
            Fork me on GitHub
          </a>
        </p>
      </div>
    </div>
  );
}
