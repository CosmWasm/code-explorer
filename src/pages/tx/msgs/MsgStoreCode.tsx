import "./MsgStoreCode.css";

import { MsgStoreCode as IMsgStoreCode } from "@cosmjs/cosmwasm";
import { fromBase64 } from "@cosmjs/encoding";
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
    const data = fromBase64(msg.value.wasm_byte_code);
    return `${getFileType(data) || "unknown"}; ${data.length} bytes`;
  }, [msg.value.wasm_byte_code]);

  return (
    <Fragment>
      <li className="list-group-item">
        Sender: <AccountLink address={msg.value.sender} maxLength={null} />
      </li>
      <li className="list-group-item">Source: {msg.value.source || "–"}</li>
      <li className="list-group-item">Builder: {msg.value.builder || "–"}</li>
      <li className="list-group-item">
        Data: {dataInfo}{" "}
        {!showAllCode ? (
          <Fragment>
            <code>{ellideRight(msg.value.wasm_byte_code, 300)}</code>{" "}
            <button className="btn btn-sm btn-outline-primary" onClick={() => setShowAllCode(true)}>
              Show all
            </button>
          </Fragment>
        ) : (
          <code className="long-inline-code">{msg.value.wasm_byte_code}</code>
        )}
      </li>
    </Fragment>
  );
}
