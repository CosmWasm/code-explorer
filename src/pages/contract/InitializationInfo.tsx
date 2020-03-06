import { ContractDetails } from "@cosmwasm/sdk";
import React from "react";

import { AccountLink } from "../../components/AccountLink";

interface Props {
  readonly contract: ContractDetails;
}

export function InitializationInfo({ contract }: Props): JSX.Element {
  return (
    <div className="card mb-3">
      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          Creator: <AccountLink address={contract.creator} maxLength={null} />
        </li>
        <li className="list-group-item">
          <span title="The contract level initialization message">Init message</span>:{" "}
          <pre className="mb-0">{JSON.stringify(contract.initMsg, null, "  ")}</pre>
        </li>
      </ul>
    </div>
  );
}
