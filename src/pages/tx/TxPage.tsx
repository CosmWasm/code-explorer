import "./TxPage.css";

import { Registry } from "@cosmjs/proto-signing";
import { codec, IndexedTx } from "@cosmjs/stargate";
import React from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

import { FooterRow } from "../../components/FooterRow";
import { Header } from "../../components/Header";
import { ClientContext } from "../../contexts/ClientContext";
import { ellideMiddle } from "../../ui-utils";
import { isLaunchpadClient, isStargateClient, LaunchpadClient, StargateClient } from "../../ui-utils/clients";
import {
  ErrorState,
  errorState,
  isErrorState,
  isLoadingState,
  LoadingState,
  loadingState,
} from "../../ui-utils/states";
import {
  isAnyMsgExecuteContract,
  isAnyMsgInstantiateContract,
  isAnyMsgSend,
  isAnyMsgStoreCode,
  launchpadTxToStargateTx,
} from "../../ui-utils/txs";
import { ExecutionInfo } from "./ExecutionInfo";
import { MsgExecuteContract } from "./msgs/MsgExecuteContract";
import { MsgInstantiateContract } from "./msgs/MsgInstantiateContract";
import { MsgSend } from "./msgs/MsgSend";
import { MsgStoreCode } from "./msgs/MsgStoreCode";
import { TxInfo } from "./TxInfo";

const { Tx } = codec.cosmos.tx.v1beta1;

const launchpadEffect = (
  client: LaunchpadClient,
  txId: string,
  typeRegistry: Registry,
  setDetails: (details: IndexedTx | undefined | ErrorState | LoadingState) => void,
) => (): void => {
  client
    .getTx(txId)
    .then((tx) => {
      const indexedTx = tx
        ? {
            height: tx.height,
            hash: tx.hash,
            code: tx.code,
            rawLog: tx.rawLog,
            tx: launchpadTxToStargateTx(typeRegistry, tx.tx),
          }
        : undefined;
      setDetails(indexedTx);
    })
    .catch(() => setDetails(errorState));
};

const stargateEffect = (
  client: StargateClient,
  txId: string,
  setDetails: (details: IndexedTx | undefined | ErrorState | LoadingState) => void,
) => (): void => {
  client
    .getTx(txId)
    .then((tx) => {
      setDetails(tx || undefined);
    })
    .catch(() => setDetails(errorState));
};

export function TxPage(): JSX.Element {
  const { client, typeRegistry } = React.useContext(ClientContext);
  const { txId: txIdParam } = useParams<{ readonly txId: string }>();
  const txId = txIdParam || "";

  const pageTitle = <span title={txId}>Tx {ellideMiddle(txId, 20)}</span>;

  const [details, setDetails] = React.useState<IndexedTx | undefined | ErrorState | LoadingState>(
    loadingState,
  );

  React.useEffect(
    isStargateClient(client)
      ? stargateEffect(client, txId, setDetails)
      : isLaunchpadClient(client)
      ? launchpadEffect(client, txId, typeRegistry, setDetails)
      : () => {},
    [client, txId, typeRegistry],
  );

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
            {isLoadingState(details) ? (
              <p>Loading...</p>
            ) : isErrorState(details) ? (
              <p>Error</p>
            ) : details === undefined ? (
              <p>Transaction not found</p>
            ) : (
              <ExecutionInfo tx={details} />
            )}
          </div>
          <div className="col">
            {isLoadingState(details) ? (
              <p>Loading …</p>
            ) : isErrorState(details) ? (
              <p>Error</p>
            ) : details === undefined ? (
              <p>Transaction not found</p>
            ) : (
              <TxInfo tx={Tx.decode(details.tx)} />
            )}
          </div>
        </div>

        <div className="row white-row white-row-last">
          <div className="col">
            <h2>Messages</h2>
            <p>
              A Cosmos SDK transaction is composed of one or more messages, that represent actions to be
              executed.
            </p>
            {isLoadingState(details) ? (
              <p>Loading …</p>
            ) : isErrorState(details) ? (
              <p>Error</p>
            ) : details === undefined ? (
              <p>Transaction not found</p>
            ) : (
              Tx.decode(details.tx).body?.messages?.map((msg, index) => (
                <div className="card mb-3" key={`${details.hash}_${index}`}>
                  <div className="card-header">
                    Message {index + 1} (Type: {msg.type_url || <em>unset</em>})
                  </div>
                  <ul className="list-group list-group-flush">
                    {isAnyMsgSend(msg) ? (
                      <MsgSend msg={typeRegistry.decode({ typeUrl: msg.type_url, value: msg.value })} />
                    ) : isAnyMsgStoreCode(msg) ? (
                      <MsgStoreCode msg={typeRegistry.decode({ typeUrl: msg.type_url, value: msg.value })} />
                    ) : isAnyMsgInstantiateContract(msg) ? (
                      <MsgInstantiateContract
                        msg={typeRegistry.decode({ typeUrl: msg.type_url, value: msg.value })}
                      />
                    ) : isAnyMsgExecuteContract(msg) ? (
                      <MsgExecuteContract
                        msg={typeRegistry.decode({ typeUrl: msg.type_url, value: msg.value })}
                      />
                    ) : (
                      <li className="list-group-item">
                        <em>This message type cannot be displayed</em>
                      </li>
                    )}
                  </ul>
                </div>
              ))
            )}
          </div>
        </div>

        <FooterRow />
      </div>
    </div>
  );
}
