import "./MsgStoreCode.css";

import { types } from "@cosmwasm/sdk";
import React, { Fragment } from "react";

import { AccountLink } from "../../../components/AccountLink";
import { ellideRight } from "../../../ui-utils";

interface Props {
  readonly msg: types.MsgStoreCode;
}

export function MsgStoreCode({ msg }: Props): JSX.Element {
  const [showAllCode, setShowAllCode] = React.useState<boolean>(false);

  return (
    <Fragment>
      <li className="list-group-item">
        Sender: <AccountLink address={msg.value.sender} maxLength={null} />
      </li>
      <li className="list-group-item">Source: {msg.value.source || "–"}</li>
      <li className="list-group-item">Builder: {msg.value.builder || "–"}</li>
      <li className="list-group-item">
        Data:&nbsp;
        {!showAllCode ? (
          <Fragment>
            <code>{ellideRight(msg.value.wasm_byte_code, 400)}</code>{" "}
            {`(${msg.value.wasm_byte_code.length} bytes)`}{" "}
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
