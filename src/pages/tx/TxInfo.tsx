import { Tx } from "@cosmjs/stargate/build/codec/cosmos/tx/v1beta1/tx";
import React from "react";

import { printableBalance } from "../../ui-utils";

interface Props {
  readonly tx: Tx;
}

export function TxInfo({ tx }: Props): JSX.Element {
  return (
    <div className="card mb-3">
      <ul className="list-group list-group-flush">
        <li className="list-group-item"><span className="font-weight-bold">Memo:</span> {tx.body?.memo || "–"}</li>
        <li className="list-group-item"><span className="font-weight-bold">Fee:</span> {printableBalance(tx.authInfo?.fee?.amount ?? [])}</li>
        <li className="list-group-item"><span className="font-weight-bold">Gas:</span> {tx.authInfo?.fee?.gasLimit?.toString() ?? "0"}</li>
        <li className="list-group-item"><span className="font-weight-bold">Signatures:</span> {tx.signatures?.length ?? 0}</li>
      </ul>
    </div>
  );
}
