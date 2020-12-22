import React from "react";

import { ClientContext } from "../contexts/ClientContext";
import {
  disableLedgerLogin,
  getAddressAndSigningClient,
  loadLedgerWallet,
  loadOrCreateWallet,
  WalletLoader,
} from "../ui-utils/clients";

export function Login(): JSX.Element {
  const { userAddress, setUserAddress, setSigningClient } = React.useContext(ClientContext);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string>();

  async function login(loadWallet: WalletLoader): Promise<void> {
    setLoading(true);
    setError(undefined);

    try {
      const [userAddress, signingClient] = await getAddressAndSigningClient(loadWallet);
      setUserAddress(userAddress);
      setSigningClient(signingClient);
    } catch (error) {
      setError(error.message);
    }

    setLoading(false);
  }

  function logout(): void {
    setError(undefined);
    setUserAddress(undefined);
    setSigningClient(undefined);
  }

  function renderLoginButton(): JSX.Element {
    return loading ? (
      <button className="btn btn-primary" type="button" disabled>
        <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
        Loading...
      </button>
    ) : (
      <>
        <button
          type="button"
          className="btn btn-primary dropdown-toggle"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          Login
        </button>
        <div className="dropdown-menu">
          <h6 className="dropdown-header">with</h6>
          <button className="dropdown-item" onClick={() => login(loadOrCreateWallet)}>
            Browser wallet
          </button>
          <button
            className="dropdown-item"
            onClick={() => login(loadLedgerWallet)}
            disabled={disableLedgerLogin()}
          >
            Ledger wallet
          </button>
        </div>
      </>
    );
  }

  function renderLogoutButton(): JSX.Element {
    return (
      <button className="btn btn-primary" onClick={logout}>
        Logout
      </button>
    );
  }

  const isUserLoggedIn = !!userAddress;

  return (
    <div className="d-flex align-items-center justify-content-end">
      {error ? <div className="mr-3 p-2 rounded bg-white text-danger">{error}</div> : null}
      {isUserLoggedIn ? renderLogoutButton() : renderLoginButton()}
    </div>
  );
}
