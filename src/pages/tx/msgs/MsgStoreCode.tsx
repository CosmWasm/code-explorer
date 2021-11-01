import "./MsgStoreCode.css";

import { MsgStoreCode as IMsgStoreCode } from "cosmjs-types/cosmwasm/wasm/v1beta1/tx";
import { toBase64 } from "@cosmjs/encoding";
import React, { Fragment } from "react";

import { AccountLink } from "../../../components/AccountLink";
import { ellideRight } from "../../../ui-utils";
import { getFileType } from "./magic";

interface Props {
  readonly msg: IMsgStoreCode;
}

export function MsgStoreCode({ msg }: Props): JSX.Element {
  const [showAllCode, setShowAllCode] = React.useState<boolean>(false);

  const dataInfo = React.useMemo(() => {
    const data = msg.wasmByteCode ?? new Uint8Array();
    return `${getFileType(data) || "unknown"}; ${data.length} bytes`;
  }, [msg.wasmByteCode]);

  return (
    <Fragment>
      <li className="list-group-item">
        <span className="font-weight-bold">Sender:</span>{" "}
        <AccountLink address={msg.sender ?? "-"} maxLength={null} />
      </li>
      <li className="list-group-item">
        <span className="font-weight-bold">Source:</span> {msg.source || "–"}
      </li>
      <li className="list-group-item">
        <span className="font-weight-bold">Builder:</span> {msg.builder || "–"}
      </li>
      <li className="list-group-item">
        <span className="font-weight-bold">Data:</span> {dataInfo}{" "}
        {!showAllCode ? (
          <Fragment>
            <code>{ellideRight(toBase64(msg.wasmByteCode ?? new Uint8Array()), 300)}</code>{" "}
            <button className="btn btn-sm btn-outline-primary" onClick={() => setShowAllCode(true)}>
              Show all
            </button>
          </Fragment>
        ) : (
          <code className="long-inline-code">{msg.wasmByteCode}</code>
        )}
      </li>
    </Fragment>
  );
}
