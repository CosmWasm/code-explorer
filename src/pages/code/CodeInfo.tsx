import { CodeDetails } from "@cosmwasm/sdk";
import React from "react";

import { AccountLink } from "../../components/AccountLink";
import VerifyContract from "./VerifyContract";

interface Props {
  readonly code: CodeDetails;
}

export function CodeInfo({ code }: Props): JSX.Element {
  return (
    <div className="card mb-3">
      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          Creator: <AccountLink address={code.creator} maxLength={null} />
        </li>
        <li className="list-group-item">Checksum: {code.checksum}</li>
        <li className="list-group-item">Source: {code.source || "–"}</li>
        <li className="list-group-item">Builder: {code.builder || "–"}</li>
        <li className="list-group-item">
          <p className="text-muted">
            Code verfication allows you to verify that uploaded code was compiled from the source it claims.{" "}
            <a href="https://github.com/confio/cosmwasm-verify" className="text-muted">
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
