import { fromRfc3339 } from "@cosmjs/encoding";
import { IndexedTx } from "@cosmjs/stargate";
import React from "react";

const checkMark = "✔"; // U+2714 HEAVY CHECK MARK
const xMark = "🗙"; // U+1F5D9 CANCELLATION X

interface Props {
  readonly tx: IndexedTx;
  readonly timestamp: string;
}

export function ExecutionInfo({ tx, timestamp }: Props): JSX.Element {
  const time = timestamp ? fromRfc3339(timestamp) : null;
  const success = tx.code === 0;

  return (
    <ul className="list-group list-group-horizontal mb-3">
      <li className="list-group-item">
        <span className="font-weight-bold">Height:</span> {tx.height}
      </li>
      <li className="list-group-item">
        <span title={timestamp}>
          <span className="font-weight-bold">Time:</span> {time?.toLocaleString()}
        </span>
      </li>
      <li className="list-group-item">
        <span title={`Execution succeeded: ${success ? "yes" : "no"}`}>
          <span className="font-weight-bold">Success:</span>{" "}
          {success ? (
            <span className="text-success">{checkMark}</span>
          ) : (
            <span className="text-danger" title={"error code: " + tx.code}>
              {xMark}
            </span>
          )}
        </span>
      </li>
    </ul>
  );
}
