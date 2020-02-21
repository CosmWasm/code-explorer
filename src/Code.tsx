import "./Code.css";

import { RestClient } from "@cosmwasm/sdk";
import React from "react";

import { settings } from "./settings";

function ellideMiddle(str: string, maxOutLen: number): string {
  if (str.length <= maxOutLen) {
    return str;
  }
  const ellide = "…";
  const frontLen = Math.ceil((maxOutLen - ellide.length) / 2);
  const tailLen = Math.floor((maxOutLen - ellide.length) / 2);
  return str.slice(0, frontLen) + ellide + str.slice(-tailLen);
}

export interface CodeData {
  readonly codeId: number;
  readonly checksum: string;
  readonly creator: string;
  readonly source: string;
  readonly builder: string;
}

interface Props {
  readonly data: CodeData;
}

interface InstantiationInfo {
  readonly instantiations: number;
}

export function Code({ data }: Props): JSX.Element {
  const [instantiationInfo, setInstantiationInfo] = React.useState<InstantiationInfo | undefined>();
  const [size, setSize] = React.useState<number | undefined>();

  React.useEffect(() => {
    const client = new RestClient(settings.nodeUrl);
    client.listContractsByCodeId(data.codeId).then(contracts => {
      setInstantiationInfo({
        instantiations: contracts.length,
      });
    });
    client.getCode(data.codeId).then(code => {
      setSize(code.length);
    });
  }, [data.codeId]);

  return (
    <div className="p-2 flex-grow-1">
      <div className="code-content">
        <div className="code-id">#{data.codeId}</div>
        <div className="code-details">
          Creator: {data.creator}
          <br />
          Source: {ellideMiddle(data.source, 45) || "–"}
          <br />
          Builder: {data.builder || "–"}
          <br />
          Checksum: {data.checksum.slice(0, 10)}
          <br />
          Size: {size ? Math.round(size / 1024) + " KiB" : "Loading …"}
          <br />
          Instances: {instantiationInfo ? instantiationInfo.instantiations : "Loading …"}
        </div>
      </div>
    </div>
  );
}
