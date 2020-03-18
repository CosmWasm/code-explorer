import { IndexedTx } from "@cosmwasm/sdk";
import React from "react";

interface Props {
  readonly tx: IndexedTx;
}

export function ExecutionInfo({ tx }: Props): JSX.Element {
  return (
    <ul className="list-group list-group-horizontal mb-3">
      <li className="list-group-item">Height: {tx.height}</li>
      <li className="list-group-item">Time: {tx.timestamp}</li>
    </ul>
  );
}
