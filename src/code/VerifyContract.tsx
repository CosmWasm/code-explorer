import React from "react";

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

  return (
    <code>
      cosmwasm-verify "{source}" "{builder}" {checksum}
    </code>
  );
}

export default VerifyContract;
