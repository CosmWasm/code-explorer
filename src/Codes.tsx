import "./Codes.css";

import { RestClient } from "@cosmwasm/sdk";
import React from "react";

import { Code, CodeData } from "./Code";
import { settings } from "./settings";

export function Codes(): JSX.Element {
  const [codes, setCodes] = React.useState<readonly CodeData[]>([]);

  React.useEffect(() => {
    const client = new RestClient(settings.nodeUrl);
    client.listCodeInfo().then(codeInfos => {
      const processed = codeInfos
        .map(
          (response): CodeData => ({
            codeId: response.id,
            checksum: response.code_hash.toLowerCase(),
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
