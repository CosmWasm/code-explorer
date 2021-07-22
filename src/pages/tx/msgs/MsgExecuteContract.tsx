import { MsgExecuteContract as MsgExecuteCtr } from "@cosmjs/cosmwasm-stargate/build/codec/cosmwasm/wasm/v1beta1/tx";
import React, { Fragment } from "react";

import { AccountLink } from "../../../components/AccountLink";
import { ContractLink } from "../../../components/ContractLink";
import { printableBalance } from "../../../ui-utils";

import ReactJson from 'react-json-view';

type IMsgExecuteContract = MsgExecuteCtr;

interface Props {
  readonly msg: IMsgExecuteContract;
}

export function MsgExecuteContract({ msg }: Props): JSX.Element {
  const parseMsgContract = (msg: Uint8Array) => {
    if (!msg) return {};
    
    let json = '';
    msg.forEach((item) => {
      json += String.fromCharCode(item);
    });

    return JSON.parse(json);
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
        <ReactJson src={parseMsgContract(msg.msg)} />
      </li>
    </Fragment>
  );
}
