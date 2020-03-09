import "./Codes.css";

import React from "react";

import { ClientContext } from "../../contexts/ClientContext";
import { Code, CodeData } from "./Code";

interface LoadedCode {
  readonly source: string;
  readonly data: CodeData;
}

function codeKey(code: LoadedCode): string {
  return `${code.source}__${code.data.codeId}`;
}

export function Codes(): JSX.Element {
  const clientContext = React.useContext(ClientContext);
  const [codes, setCodes] = React.useState<readonly LoadedCode[] | "loading">("loading");

  React.useEffect(() => {
    clientContext.client.getCodes().then(codeInfos => {
      const processed = codeInfos
        .map(
          (response): LoadedCode => ({
            source: clientContext.nodeUrl,
            data: {
              codeId: response.id,
              checksum: response.checksum,
              creator: response.creator,
              source: response.source || "",
              builder: response.builder || "",
            },
          }),
        )
        .reverse();
      setCodes(processed);
    });
  }, [clientContext]);

  return (
    <div className="d-flex flex-wrap mb-3">
      {codes === "loading" ? (
        <p>Loading …</p>
      ) : codes.length === 0 ? (
        <p>No code uploaded yet</p>
      ) : (
        codes.map(code => <Code data={code.data} key={codeKey(code)} />)
      )}
    </div>
  );
}
