import { types } from "@cosmwasm/sdk";
import React from "react";

import { printableBalance } from "../../ui-utils";

interface Props {
  readonly tx: types.CosmosSdkTx;
}

export function TxInfo({ tx }: Props): JSX.Element {
  return (
    <div className="card mb-3">
      <ul className="list-group list-group-flush">
        <li className="list-group-item">Memo: {tx.value.memo || "–"}</li>
        <li className="list-group-item">Fee: {printableBalance(tx.value.fee.amount)}</li>
        <li className="list-group-item">Gas: {tx.value.fee.gas}</li>
        <li className="list-group-item">Signatures: {tx.value.signatures.length}</li>
      </ul>
    </div>
  );
}
