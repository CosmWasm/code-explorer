import { MsgSend as IMsgSend } from "cosmjs-types/cosmos/bank/v1beta1/tx";
import React, { Fragment } from "react";

import { AccountLink } from "../../../components/AccountLink";
import { printableBalance } from "../../../ui-utils";

interface Props {
  readonly msg: IMsgSend;
}

export function MsgSend({ msg }: Props): JSX.Element {
  return (
    <Fragment>
      <li className="list-group-item">
        <span className="font-weight-bold">Sender:</span>{" "}
        <AccountLink address={msg.fromAddress ?? "-"} maxLength={null} />
      </li>
      <li className="list-group-item">
        <span className="font-weight-bold">Recipient:</span>{" "}
        <AccountLink address={msg.toAddress ?? "-"} maxLength={null} />
      </li>
      <li className="list-group-item">
        <span className="font-weight-bold">Amount:</span> {printableBalance(msg.amount ?? [])}
      </li>
    </Fragment>
  );
}
