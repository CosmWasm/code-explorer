import React from "react";
import { Link } from "react-router-dom";

import { ellideMiddle } from "../ui-utils";

interface Props {
  readonly address: string;
  readonly length?: number;
}

export function ContractLink({ address, length = 20 }: Props): JSX.Element {
  return (
    <Link to={`/contracts/${address}`} title={address}>
      {ellideMiddle(address, length)}
    </Link>
  );
}
