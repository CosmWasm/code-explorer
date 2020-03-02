import React from "react";
import { quote } from "shell-quote";

interface Props {
  readonly checksum: string;
  readonly source: string | undefined;
  readonly builder: string | undefined;
}

function VerifyContract({ checksum, source, builder }: Props): JSX.Element {
  if (!source || !builder) {
    return (
      <span>
        Contract cannot be verified since <code>builder</code> or <code>source</code> is missing
      </span>
    );
  }

  const verificationCmd = quote(["cosmwasm-verify", source, builder, checksum]);

  return <code>{verificationCmd}</code>;
}

export default VerifyContract;
