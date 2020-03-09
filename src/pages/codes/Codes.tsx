import "./Codes.css";

import React from "react";

import { ClientContext } from "../../contexts/ClientContext";
import { Code, CodeData } from "./Code";

export function Codes(): JSX.Element {
  const clientContext = React.useContext(ClientContext);
  const [codes, setCodes] = React.useState<readonly CodeData[] | "loading">("loading");

  React.useEffect(() => {
    clientContext.client.getCodes().then(codeInfos => {
      const processed = codeInfos
        .map(
          (response): CodeData => ({
            codeId: response.id,
            checksum: response.checksum,
            creator: response.creator,
            source: response.source || "",
            builder: response.builder || "",
          }),
        )
        .reverse();
      setCodes(processed);
    });
  }, [clientContext.client]);

  return (
    <div className="d-flex flex-wrap mb-3">
      {codes === "loading" ? (
        <p>Loading …</p>
      ) : codes.length === 0 ? (
        <p>No code uploaded yet</p>
      ) : (
        codes.map(code => <Code data={code} key={code.codeId} />)
      )}
    </div>
  );
}
