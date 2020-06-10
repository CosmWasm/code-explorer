import { MsgInstantiateContract as IMsgInstantiateContract } from "@cosmjs/cosmwasm";
import React, { Fragment } from "react";

import { AccountLink } from "../../../components/AccountLink";
import { CodeLink } from "../../../components/CodeLink";
import { printableBalance } from "../../../ui-utils";

interface Props {
  readonly msg: IMsgInstantiateContract;
}

export function MsgInstantiateContract({ msg }: Props): JSX.Element {
  return (
    <Fragment>
      <li className="list-group-item">
        Sender: <AccountLink address={msg.value.sender} maxLength={null} />
      </li>
      <li className="list-group-item">
        Code ID: <CodeLink codeId={parseInt(msg.value.code_id)} text={msg.value.code_id} />
      </li>
      <li className="list-group-item">Label: {msg.value.label}</li>
      <li className="list-group-item">Init funds: {printableBalance(msg.value.init_funds)}</li>
      <li className="list-group-item">
        <span title="The contract level message">Init message</span>:{" "}
        <pre className="mb-0">{JSON.stringify(msg.value.init_msg, null, "  ")}</pre>
      </li>
    </Fragment>
  );
}
