import { MsgInstantiateContract as IMsgInstantiateContract } from "@cosmjs/cosmwasm-stargate/build/codec/cosmwasm/wasm/v1beta1/tx";
import React, { Fragment } from "react";
import ReactJson from "react-json-view";

import { AccountLink } from "../../../components/AccountLink";
import { CodeLink } from "../../../components/CodeLink";
import { parseMsgContract, printableBalance } from "../../../ui-utils";

interface Props {
  readonly msg: IMsgInstantiateContract;
}

export function MsgInstantiateContract({ msg }: Props): JSX.Element {
  return (
    <Fragment>
      <li className="list-group-item">
        <span className="font-weight-bold">Sender:</span>{" "}
        <AccountLink address={msg.sender || "-"} maxLength={null} />
      </li>
      <li className="list-group-item">
        <span className="font-weight-bold">Code ID:</span>{" "}
        <CodeLink codeId={msg.codeId?.toNumber() ?? 0} text={msg.codeId?.toString() ?? "-"} />
      </li>
      <li className="list-group-item">
        <span className="font-weight-bold">Label:</span> {msg.label}
      </li>
      <li className="list-group-item">
        <span className="font-weight-bold">Init funds:</span> {printableBalance(msg.funds)}
      </li>
      <li className="list-group-item">
        <span title="The contract level message" className="font-weight-bold">
          Init message
        </span>
        :
        <ReactJson src={parseMsgContract(msg.initMsg)} theme="monokai" />
      </li>
    </Fragment>
  );
}
