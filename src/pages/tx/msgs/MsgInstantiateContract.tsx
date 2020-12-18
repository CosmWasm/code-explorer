import { codec } from "@cosmjs/cosmwasm-stargate";
import React, { Fragment } from "react";

import { AccountLink } from "../../../components/AccountLink";
import { CodeLink } from "../../../components/CodeLink";
import { printableBalance } from "../../../ui-utils";

type IMsgInstantiateContract = codec.cosmwasm.wasm.v1beta1.IMsgInstantiateContract;

interface Props {
  readonly msg: IMsgInstantiateContract;
}

export function MsgInstantiateContract({ msg }: Props): JSX.Element {
  return (
    <Fragment>
      <li className="list-group-item">
        Sender: <AccountLink address={msg.sender || "-"} maxLength={null} />
      </li>
      <li className="list-group-item">
        Code ID: <CodeLink codeId={msg.codeId?.toNumber() ?? 0} text={msg.codeId?.toString() ?? "-"} />
      </li>
      <li className="list-group-item">Label: {msg.label}</li>
      <li className="list-group-item">Init funds: {printableBalance(msg.initFunds ?? [])}</li>
      <li className="list-group-item">
        <span title="The contract level message">Init message</span>:{" "}
        <pre className="mb-0">{JSON.stringify(msg.initMsg, null, "  ")}</pre>
      </li>
    </Fragment>
  );
}
