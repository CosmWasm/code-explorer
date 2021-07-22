import { ContractCodeHistoryEntry } from "@cosmjs/cosmwasm-stargate";
import React from "react";

import { CodeLink } from "../../components/CodeLink";

interface Props {
  readonly contractCodeHistory: readonly ContractCodeHistoryEntry[];
}

export function HistoryInfo({ contractCodeHistory }: Props): JSX.Element {
  return (
    <div className="card mb-3">
      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          <span title="The contract level message history">History</span>
        </li>
        {contractCodeHistory.map((entry, index) => (
          <li key={index} className="list-group-item">
            <span title="The message operation type">
              {entry.operation} - <CodeLink codeId={entry.codeId} />
            </span>
            <pre className="mb-0">{JSON.stringify(entry.msg, null, "  ")}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
}
