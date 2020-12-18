import { codec } from "@cosmjs/stargate";
import React, { Fragment } from "react";

import { AccountLink } from "../../../components/AccountLink";
import { printableBalance } from "../../../ui-utils";

type IMsgSend = codec.cosmos.bank.v1beta1.IMsgSend;

interface Props {
  readonly msg: IMsgSend;
}

export function MsgSend({ msg }: Props): JSX.Element {
  return (
    <Fragment>
      <li className="list-group-item">
        Sender: <AccountLink address={msg.fromAddress ?? "-"} maxLength={null} />
      </li>
      <li className="list-group-item">
        Recipient: <AccountLink address={msg.toAddress ?? "-"} maxLength={null} />
      </li>
      <li className="list-group-item">Amount: {printableBalance(msg.amount ?? [])}</li>
    </Fragment>
  );
}
