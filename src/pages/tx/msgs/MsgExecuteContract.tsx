import { MsgExecuteContract as IMsgExecuteContract } from "@cosmjs/cosmwasm-stargate/build/codec/cosmwasm/wasm/v1beta1/tx";
import React, { Fragment } from "react";
import ReactJson from "react-json-view";

import { AccountLink } from "../../../components/AccountLink";
import { ContractLink } from "../../../components/ContractLink";
import { parseMsgContract, printableBalance } from "../../../ui-utils";

interface Props {
  readonly msg: IMsgExecuteContract;
}

export function MsgExecuteContract({ msg }: Props): JSX.Element {
  return (
    <Fragment>
      <li className="list-group-item">
        <span className="font-weight-bold">Contract:</span>{" "}
        <ContractLink address={msg.contract ?? "-"} maxLength={null} />
      </li>
      <li className="list-group-item">
        <span className="font-weight-bold">Sender:</span>{" "}
        <AccountLink address={msg.sender ?? "-"} maxLength={null} />
      </li>
      <li className="list-group-item">
        <span className="font-weight-bold">Sent funds:</span> {printableBalance(msg.funds)}
      </li>
      <li className="list-group-item">
        <span title="The contract level message" className="font-weight-bold">
          Handle message
        </span>
        :
        <ReactJson src={parseMsgContract(msg.msg)} theme="monokai" />
      </li>
    </Fragment>
  );
}
