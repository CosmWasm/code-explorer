import { Account, CosmWasmClient } from "@cosmwasm/sdk";
import React from "react";
import { Link, useParams } from "react-router-dom";

import { FooterRow } from "../../components/FooterRow";
import { Header } from "../../components/Header";
import { settings } from "../../settings";
import { ellideMiddle, printableBalance } from "../../ui-utils";

export function AccountPage(): JSX.Element {
  const { address: addressParam } = useParams();
  const address = addressParam || "";

  const [account, setAccount] = React.useState<Account | undefined>();

  React.useEffect(() => {
    const client = new CosmWasmClient(settings.backend.nodeUrl);
    client.getAccount(address).then(setAccount);
  }, [address]);

  const pageTitle = <span title={address}>Account {ellideMiddle(address, 15)}</span>;

  return (
    <div className="page">
      <Header />
      <div className="container mt-3 contract-container">
        <div className="row white-row white-row-first">
          <div className="col">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {pageTitle}
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="row white-row white-row-last">
          <div className="col">
            <h1>{pageTitle}</h1>
            <ul className="list-group list-group-horizontal mb-3">
              <li className="list-group-item" title="Bank tokens owned by this contract">
                Balance: {printableBalance(account?.balance || [])}
              </li>
            </ul>
          </div>
        </div>

        <FooterRow backend={settings.backend} />
      </div>
    </div>
  );
}
