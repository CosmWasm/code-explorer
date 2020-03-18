import { IndexedTx } from "@cosmwasm/sdk";
import { Encoding } from "@iov/encoding";
import React from "react";

interface Props {
  readonly tx: IndexedTx;
}

export function ExecutionInfo({ tx }: Props): JSX.Element {
  const time = Encoding.fromRfc3339(tx.timestamp);
  return (
    <ul className="list-group list-group-horizontal mb-3">
      <li className="list-group-item">Height: {tx.height}</li>
      <li className="list-group-item">
        <span title={tx.timestamp}>Time: {time.toLocaleString()}</span>
      </li>
    </ul>
  );
}
