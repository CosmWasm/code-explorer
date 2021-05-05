import { DecodedTxRaw } from "@cosmjs/proto-signing";
import React from "react";

import { printableBalance } from "../../ui-utils";

interface Props {
  readonly tx: DecodedTxRaw;
}

export function TxInfo({ tx }: Props): JSX.Element {
  return (
    <div className="card mb-3">
      <ul className="list-group list-group-flush">
        <li className="list-group-item">Memo: {tx.body.memo || "–"}</li>
        <li className="list-group-item">Fee: {printableBalance(tx.authInfo.fee?.amount ?? [])}</li>
        <li className="list-group-item">Gas: {tx.authInfo.fee?.gasLimit?.toString() ?? "0"}</li>
        <li className="list-group-item">Signatures: {tx.signatures.length}</li>
      </ul>
    </div>
  );
}
