import { CodeDetails } from "@cosmjs/cosmwasm-stargate";
import React from "react";

import { AccountLink } from "../../components/AccountLink";
import { TransactionLink } from "../../components/TransactionLink";
import { ErrorState, isErrorState, isLoadingState, LoadingState } from "../../ui-utils/states";
import VerifyContract from "./VerifyContract";

interface Props {
  readonly code: CodeDetails;
  readonly uploadTxHash: string | undefined | ErrorState | LoadingState;
}

export function CodeInfo({ code, uploadTxHash }: Props): JSX.Element {
  return (
    <div className="card mb-3">
      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          Upload transaction:{" "}
          {isLoadingState(uploadTxHash) ? (
            "Loading …"
          ) : isErrorState(uploadTxHash) ? (
            "Error"
          ) : uploadTxHash === undefined ? (
            "–"
          ) : (
            <TransactionLink transactionId={uploadTxHash} />
          )}
        </li>
        <li className="list-group-item">
          Creator: <AccountLink address={code.creator} maxLength={null} />
        </li>
        <li className="list-group-item">Checksum: {code.checksum}</li>
        <li className="list-group-item">Source: {code.source || "–"}</li>
        <li className="list-group-item">Builder: {code.builder || "–"}</li>
        <li className="list-group-item">
          <p className="text-muted">
            Code verification allows you to verify that uploaded code was compiled from the source it claims.{" "}
            <a href="https://github.com/CosmWasm/cosmwasm-verify" className="text-muted">
              Tell me more!
            </a>
          </p>
          <p className="mb-0">
            <VerifyContract checksum={code.checksum} source={code.source} builder={code.builder} />
          </p>
        </li>
      </ul>
    </div>
  );
}
