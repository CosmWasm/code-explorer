import React from "react";

import { ClientContext } from "../contexts/ClientContext";
import {
  getAddressAndStargateSigningClient,
  loadLedgerWallet,
  loadOrCreateWalletDirect,
  WalletLoaderAmino,
  WalletLoaderDirect,
  webUsbMissing,
} from "../ui-utils/clients";

export function Login(): JSX.Element {
  const { userAddress, setUserAddress, setSigningClient } = React.useContext(ClientContext);
  const [mnemonic, setMnemonic] = React.useState<string>();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string>();

  async function loginStargate(loadWallet: WalletLoaderDirect | WalletLoaderAmino): Promise<void> {
    setLoading(true);
    setError(undefined);

    try {
      const [userAddress, signingClient] = await getAddressAndStargateSigningClient(loadWallet, mnemonic);
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
    setMnemonic(undefined);
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
        <div className="mr-3 p-2 rounded bg-white">
          <span title="Mnemonic for burner wallet">Mnemonic:</span>
          <input
            className="ml-3 flex-grow-1"
            value={mnemonic}
            onChange={(event) => setMnemonic(event.target.value)}
          />
        </div>
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
          <button className="dropdown-item" onClick={() => loginStargate(loadOrCreateWalletDirect)}>
            Browser wallet
          </button>
          <button
            className="dropdown-item"
            onClick={() => loginStargate(loadLedgerWallet)}
            disabled={webUsbMissing()}
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
