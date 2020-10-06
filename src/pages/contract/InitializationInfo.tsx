import { Contract, ContractCodeHistoryEntry } from "@cosmjs/cosmwasm";
import { IndexedTx } from "@cosmjs/launchpad";
import React, { useEffect, useState } from "react";

import { AccountLink } from "../../components/AccountLink";
import { TransactionLink } from "../../components/TransactionLink";
import { ClientContext } from "../../contexts/ClientContext";
import { ErrorState, isErrorState, isLoadingState, LoadingState } from "../../ui-utils/states";

interface Props {
  readonly contract: Contract;
  readonly instantiationTx: IndexedTx | undefined | ErrorState | LoadingState;
}

export function InitializationInfo({ contract, instantiationTx }: Props): JSX.Element {
  const { client } = React.useContext(ClientContext);
  const [contractCodeHistory, setContractCodeHistory] = useState<readonly ContractCodeHistoryEntry[]>([]);

  useEffect(() => {
    client.getContractCodeHistory(contract.address).then(setContractCodeHistory);
  }, [client, contract.address]);

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
          Admin: {contract.admin ? <AccountLink address={contract.admin} maxLength={null} /> : "–"}
        </li>
        <li className="list-group-item">
          <span title="The contract level initialization message">Init message</span>:{" "}
          <pre className="mb-0">{JSON.stringify(contractCodeHistory, null, "  ")}</pre>
        </li>
      </ul>
    </div>
  );
}
