import { fromRfc3339 } from "@cosmjs/encoding";
import { IndexedTx } from "@cosmjs/launchpad";
import React from "react";

const checkMark = "✔"; // U+2714 HEAVY CHECK MARK
const xMark = "🗙"; // U+1F5D9 CANCELLATION X

interface Props {
  readonly tx: IndexedTx;
}

export function ExecutionInfo({ tx }: Props): JSX.Element {
  const time = fromRfc3339(tx.timestamp);
  const success = tx.code === 0;

  return (
    <ul className="list-group list-group-horizontal mb-3">
      <li className="list-group-item">Height: {tx.height}</li>
      <li className="list-group-item">
        <span title={tx.timestamp}>Time: {time.toLocaleString()}</span>
      </li>
      <li className="list-group-item">
        <span title={`Execution succeeded: ${success ? "yes" : "no"}`}>
          Success: {success ? checkMark : `${xMark} (error code ${tx.code})`}
        </span>
      </li>
    </ul>
  );
}
