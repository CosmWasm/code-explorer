import React from "react";
import { Link } from "react-router-dom";

import { ClientContext } from "../contexts/ClientContext";

export function UserAddress(): JSX.Element {
  const { userAddress } = React.useContext(ClientContext);

  return (userAddress ? (
    <>
      <Link className="btn btn-light mr-3" to={`/codes/new`}>Upload</Link>
      <div className="mr-3 p-2 rounded bg-white">
        <span className="badge">{userAddress}</span>
      </div>
    </>
  ) : (
    <></>
  ));
}
