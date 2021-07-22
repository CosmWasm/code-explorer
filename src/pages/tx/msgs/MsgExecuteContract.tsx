import { MsgExecuteContract as MsgExecuteCtr } from "@cosmjs/cosmwasm-stargate/build/codec/cosmwasm/wasm/v1beta1/tx";
import React, { Fragment } from "react";

import { AccountLink } from "../../../components/AccountLink";
import { ContractLink } from "../../../components/ContractLink";
import { printableBalance } from "../../../ui-utils";

type IMsgExecuteContract = MsgExecuteCtr;

interface Props {
  readonly msg: IMsgExecuteContract;
}

export function MsgExecuteContract({ msg }: Props): JSX.Element {
  const printableMsgContract = (msg: Uint8Array) => {
    let result = '';
    msg?.forEach((item) => {
      result += String.fromCharCode(item);
    });

    return result;
  };

  return (
    <Fragment>
      <li className="list-group-item">
        Contract: <ContractLink address={msg.contract ?? "-"} maxLength={null} />
      </li>
      <li className="list-group-item">
        Sender: <AccountLink address={msg.sender ?? "-"} maxLength={null} />
      </li>
      <li className="list-group-item">Sent funds: {printableBalance(msg.funds)}</li>
      <li className="list-group-item">
        <span title="The contract level message">Handle message</span>: <br />
        <code>{printableMsgContract(msg.msg)}</code>
      </li>
    </Fragment>
  );
}
