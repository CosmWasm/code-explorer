import { Account, types } from "@cosmwasm/sdk";
import React from "react";
import { Link, useParams } from "react-router-dom";

import { FooterRow } from "../../components/FooterRow";
import { Header } from "../../components/Header";
import { ClientContext } from "../../contexts/ClientContext";
import { ellideMiddle, printableBalance } from "../../ui-utils";
import {
  ErrorState,
  errorState,
  isErrorState,
  isLoadingState,
  LoadingState,
  loadingState,
} from "../../ui-utils/states";
import { Transfer, TransfersTable } from "./TransfersTable";

export function AccountPage(): JSX.Element {
  const clientContext = React.useContext(ClientContext);
  const { address: addressParam } = useParams();
  const address = addressParam || "";

  const [account, setAccount] = React.useState<Account | undefined | ErrorState | LoadingState>(loadingState);
  const [transfers, setTransfers] = React.useState<readonly Transfer[] | ErrorState | LoadingState>(
    loadingState,
  );

  React.useEffect(() => {
    clientContext.client
      .getAccount(address)
      .then(setAccount)
      .catch(() => setAccount(errorState));
    clientContext.client
      .searchTx({ sentFromOrTo: address })
      .then((execTxs) => {
        const out = new Array<Transfer>();
        for (const tx of execTxs) {
          for (const [index, msg] of tx.tx.value.msg.entries()) {
            if (types.isMsgSend(msg)) {
              out.push({
                key: `${tx.hash}_${index}`,
                height: tx.height,
                transactionId: tx.hash,
                msg: msg,
              });
            } else {
              // skip
            }
          }
        }
        setTransfers(out);
      })
      .catch(() => setAccount(errorState));
  }, [address, clientContext.client]);

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

        <div className="row white-row">
          <div className="col">
            <h1>{pageTitle}</h1>
            <ul className="list-group list-group-horizontal mb-3">
              <li className="list-group-item" title="Bank tokens owned by this contract">
                Balance:{" "}
                {isLoadingState(account)
                  ? "Loading …"
                  : isErrorState(account)
                  ? "Error"
                  : printableBalance(account?.balance || [])}
              </li>
            </ul>
          </div>
        </div>

        <div className="row white-row white-row-last">
          <div className="col">
            <h2>Token transfers</h2>
            <p>Incoming and outgoing bank token transfers</p>
            {isLoadingState(transfers) ? (
              <p>Loading …</p>
            ) : isErrorState(transfers) ? (
              <p>Error</p>
            ) : transfers.length === 0 ? (
              <p>No transfer found</p>
            ) : (
              <TransfersTable transfers={transfers} />
            )}
          </div>
        </div>

        <FooterRow />
      </div>
    </div>
  );
}
