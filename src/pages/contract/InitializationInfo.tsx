import { ContractDetails, IndexedTx } from "@cosmwasm/sdk";
import React from "react";

import { AccountLink } from "../../components/AccountLink";
import { TransactionLink } from "../../components/TransactionLink";
import { ErrorState, isErrorState, isLoadingState, LoadingState } from "../../ui-utils/states";

interface Props {
  readonly contract: ContractDetails;
  readonly instantiationTx: IndexedTx | undefined | ErrorState | LoadingState;
}

export function InitializationInfo({ contract, instantiationTx }: Props): JSX.Element {
  return (
    <div className="card mb-3">
      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          Instantiation transaction:{" "}
          {isLoadingState(instantiationTx) ? (
            "Loading …"
          ) : isErrorState(instantiationTx) ? (
            "Error"
          ) : instantiationTx === undefined ? (
            "–"
          ) : (
            <TransactionLink transactionId={instantiationTx.hash} />
          )}
        </li>
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
