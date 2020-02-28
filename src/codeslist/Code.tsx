import "./Code.css";

import { CosmWasmClient } from "@cosmwasm/sdk";
import React from "react";
import { Link } from "react-router-dom";

import { settings } from "../settings";
import { ellideMiddle } from "../ui-utils";

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
    const client = new CosmWasmClient(settings.nodeUrl);
    client.getContracts(data.codeId).then(contracts => {
      setInstantiationInfo({
        instantiations: contracts.length,
      });
    });
    client.getCodeDetails(data.codeId).then(code => {
      setSize(code.wasm.length);
    });
  }, [data.codeId]);

  return (
    <div className="p-2 flex-grow-1">
      <Link to={`/codes/${data.codeId}`} className="code-content">
        <div className="id">#{data.codeId}</div>
        <div className="details">
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
      </Link>
    </div>
  );
}
