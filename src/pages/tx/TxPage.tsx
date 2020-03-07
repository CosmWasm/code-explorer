import "./TxPage.css";

import { CosmWasmClient, IndexedTx, types } from "@cosmwasm/sdk";
import React from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

import { FooterRow } from "../../components/FooterRow";
import { Header } from "../../components/Header";
import { settings } from "../../settings";
import { ellideMiddle } from "../../ui-utils";
import { MsgExecuteContract } from "./msgs/MsgExecuteContract";

export function TxPage(): JSX.Element {
  const { txId: txIdParam } = useParams();
  const txId = txIdParam || "";

  const pageTitle = <span title={txId}>Tx {ellideMiddle(txId, 20)}</span>;

  const [details, setDetails] = React.useState<IndexedTx | undefined | "loading">("loading");

  React.useEffect(() => {
    const client = new CosmWasmClient(settings.backend.nodeUrl);
    client.searchTx({ id: txId }).then(results => {
      const firstResult = results.find(() => true);
      setDetails(firstResult);
    });
  }, [txId]);

  return (
    <div className="page">
      <Header />
      <div className="container mt-3">
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
              <li className="list-group-item">
                Height: {details === "loading" ? "Loading..." : details?.height || "–"}
              </li>
              <li className="list-group-item">
                Time: {details === "loading" ? "Loading..." : details?.timestamp || "–"}
              </li>
              <li className="list-group-item">
                Signatures:{" "}
                {details === "loading" ? "Loading..." : details?.tx.value.signatures.length || "–"}
              </li>
            </ul>
          </div>
        </div>

        <div className="row white-row white-row-last">
          <div className="col">
            <h2>Messages</h2>
            <p>
              A Cosmos SDK transaction is composed of one or more messages, that represent actions to be
              executed.
            </p>
            {details === "loading" ? (
              <p>Loading …</p>
            ) : (
              <div>
                {details ? (
                  details.tx.value.msg.map((msg, index) => (
                    <div className="card" key={`${details.hash}_${index}`}>
                      <div className="card-header">Type: {msg.type}</div>
                      <ul className="list-group list-group-flush">
                        {types.isMsgExecuteContract(msg) && <MsgExecuteContract msg={msg} />}
                      </ul>
                    </div>
                  ))
                ) : (
                  <p>Transaction not found</p>
                )}
              </div>
            )}
          </div>
        </div>

        <FooterRow backend={settings.backend} />
      </div>
    </div>
  );
}
