import { Code } from "@cosmwasm/sdk";
import React from "react";

import VerifyContract from "./VerifyContract";

interface Props {
  readonly code: Code;
}

function Verification({ code }: Props): JSX.Element {
  return (
    <div>
      <p>
        Checksum: {code.checksum.slice(0, 12)}
        <br />
        Source: {code.source || "–"}
        <br />
        Builder: {code.builder || "–"}
      </p>
      <p>
        <strong>Verify contract</strong> (
        <a href="https://github.com/confio/cosmwasm-verify">What is this?</a>)
        <br />
        <VerifyContract checksum={code.checksum} source={code.source} builder={code.builder} />
      </p>
    </div>
  );
}

export default Verification;
