import "./Codes.css";

import { CosmWasmClient } from "@cosmwasm/sdk";
import React from "react";

import { settings } from "../settings";
import { Code, CodeData } from "./Code";

export function Codes(): JSX.Element {
  const [codes, setCodes] = React.useState<readonly CodeData[]>([]);

  React.useEffect(() => {
    const client = new CosmWasmClient(settings.backend.nodeUrl);
    client.getCodes().then(codeInfos => {
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
  }, []);

  return (
    <div className="d-flex flex-wrap mb-3">
      {codes.map(code => (
        <Code data={code} key={code.codeId} />
      ))}
    </div>
  );
}
