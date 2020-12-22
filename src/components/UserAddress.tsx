import React from "react";

import { ClientContext } from "../contexts/ClientContext";

export function UserAddress(): JSX.Element {
  const { signingClient } = React.useContext(ClientContext);

  return signingClient?.senderAddress ? (
    <div className="mr-3 p-2 rounded bg-white">
      <span>My address: </span>
      <span>{signingClient.senderAddress}</span>
    </div>
  ) : (
    <></>
  );
}
