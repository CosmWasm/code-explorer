import { types } from "@cosmwasm/sdk";
import React, { Fragment } from "react";

import { AccountLink } from "../../../components/AccountLink";
import { ContractLink } from "../../../components/ContractLink";
import { printableBalance } from "../../../ui-utils";

interface Props {
  readonly msg: types.MsgExecuteContract;
}

export function MsgExecuteContract({ msg }: Props): JSX.Element {
  return (
    <Fragment>
      <li className="list-group-item">
        Contract: <ContractLink address={msg.value.contract} maxLength={null} />
      </li>
      <li className="list-group-item">
        Sender: <AccountLink address={msg.value.sender} maxLength={null} />
      </li>
      <li className="list-group-item">Sent funds: {printableBalance(msg.value.sent_funds)}</li>
      <li className="list-group-item">
        <span title="The contract level message">Handle message</span>:{" "}
        <pre className="mb-0">{JSON.stringify(msg.value.msg, null, "  ")}</pre>
      </li>
    </Fragment>
  );
}
