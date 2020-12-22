import "./ContractPage.css";

import {
  Contract,
  ContractCodeHistoryEntry,
  isMsgExecuteContract,
  MsgExecuteContract,
} from "@cosmjs/cosmwasm";
import { Coin, IndexedTx as LaunchpadIndexedTx } from "@cosmjs/launchpad";
import { Registry } from "@cosmjs/proto-signing";
import { codec, IndexedTx } from "@cosmjs/stargate";
import React from "react";
import { Link, useParams } from "react-router-dom";

import { CodeLink } from "../../components/CodeLink";
import { FooterRow } from "../../components/FooterRow";
import { Header } from "../../components/Header";
import { ClientContext } from "../../contexts/ClientContext";
import { settings } from "../../settings";
import { ellideMiddle, printableBalance } from "../../ui-utils";
import { isLaunchpadClient, isStargateClient, LaunchpadClient, StargateClient } from "../../ui-utils/clients";
import { makeTags } from "../../ui-utils/sdkhelpers";
import {
  ErrorState,
  errorState,
  isErrorState,
  isLoadingState,
  LoadingState,
  loadingState,
} from "../../ui-utils/states";
import { ExecuteContract } from "./ExecuteContract";
import { Execution, ExecutionsTable } from "./ExecutionsTable";
import { HistoryInfo } from "./HistoryInfo";
import { InitializationInfo } from "./InitializationInfo";
import { QueryContract } from "./QueryContract";

type ICoin = codec.cosmos.base.v1beta1.ICoin;
type IAny = codec.google.protobuf.IAny;

type IAnyMsgExecuteContract = {
  readonly type_url: "/cosmwasm.wasm.v1beta1.MsgExecuteContract";
  readonly value: Uint8Array;
};

export type Result<T> = { readonly result?: T; readonly error?: string };

const { Tx } = codec.cosmos.tx.v1beta1;

function isStargateMsgExecuteContract(msg: IAny): msg is IAnyMsgExecuteContract {
  return msg.type_url === "/cosmwasm.wasm.v1beta1.MsgExecuteContract" && !!msg.value;
}

const getAndSetDetails = (
  client: LaunchpadClient | StargateClient,
  contractAddress: string,
  setDetails: (details: Contract | ErrorState | LoadingState) => void,
): void => {
  client
    .getContract(contractAddress)
    .then(setDetails)
    .catch(() => setDetails(errorState));
};

const getAndSetContractCodeHistory = (
  client: LaunchpadClient | StargateClient,
  contractAddress: string,
  setContractCodeHistory: (contractCodeHistory: readonly ContractCodeHistoryEntry[]) => void,
): void => {
  client
    .getContractCodeHistory(contractAddress)
    .then(setContractCodeHistory)
    .catch((error) => {
      console.error(error);
    });
};

const getAndSetInstantiationTxHash = (
  client: LaunchpadClient | StargateClient,
  contractAddress: string,
  setInstantiationTxHash: (instantiationTxHash: string | undefined | ErrorState | LoadingState) => void,
): void => {
  (client.searchTx({
    tags: makeTags(
      `message.module=wasm&message.action=instantiate&message.contract_address=${contractAddress}`,
    ),
  }) as Promise<ReadonlyArray<{ readonly hash: string }>>)
    .then((results) => {
      const first = results.find(() => true);
      setInstantiationTxHash(first?.hash);
    })
    .catch(() => setInstantiationTxHash(errorState));
};

function getExecutionFromStargateMsgExecuteContract(typeRegistry: Registry, tx: IndexedTx) {
  return (msg: IAnyMsgExecuteContract, i: number) => {
    const decodedMsg = typeRegistry.decode({ typeUrl: msg.type_url, value: msg.value });
    return {
      key: `${tx.hash}_${i}`,
      height: tx.height,
      transactionId: tx.hash,
      msg: decodedMsg,
    };
  };
}

function getExecutionFromLaunchpadMsgExecuteContract(tx: LaunchpadIndexedTx) {
  return (msg: MsgExecuteContract, i: number): Execution => ({
    key: `${tx.hash}_${i}`,
    height: tx.height,
    transactionId: tx.hash,
    msg: {
      sender: msg.value.sender,
      contract: msg.value.contract,
      msg: msg.value.msg,
      sentFunds: [...msg.value.sent_funds],
    },
  });
}

const launchpadEffect = (
  client: LaunchpadClient,
  contractAddress: string,
  setBalance: (balance: readonly ICoin[] | ErrorState | LoadingState) => void,
  setContractCodeHistory: (contractCodeHistory: readonly ContractCodeHistoryEntry[]) => void,
  setDetails: (details: Contract | ErrorState | LoadingState) => void,
  setExecutions: (executions: readonly Execution[] | ErrorState | LoadingState) => void,
  setInstantiationTxHash: (instantiationTxHash: string | undefined | ErrorState | LoadingState) => void,
) => () => {
  getAndSetContractCodeHistory(client, contractAddress, setContractCodeHistory);
  getAndSetDetails(client, contractAddress, setDetails);
  getAndSetInstantiationTxHash(client, contractAddress, setInstantiationTxHash);

  client
    .getAccount(contractAddress)
    .then((account) => setBalance(account?.balance ?? []))
    .catch(() => setBalance(errorState));

  client
    .searchTx({
      tags: makeTags(`message.contract_address=${contractAddress}&message.action=execute`),
    })
    .then((txs) => {
      const out = txs.reduce(
        (executions: readonly Execution[], tx: LaunchpadIndexedTx): readonly Execution[] => {
          const txExecutions = tx.tx.value.msg
            .filter(isMsgExecuteContract)
            .map(getExecutionFromLaunchpadMsgExecuteContract(tx));
          return [...executions, ...txExecutions];
        },
        [],
      );
      setExecutions(out);
    })
    .catch(() => setExecutions(errorState));
};

const stargateEffect = (
  client: StargateClient,
  contractAddress: string,
  typeRegistry: Registry,
  setBalance: (balance: readonly ICoin[] | ErrorState | LoadingState) => void,
  setContractCodeHistory: (contractCodeHistory: readonly ContractCodeHistoryEntry[]) => void,
  setDetails: (details: Contract | ErrorState | LoadingState) => void,
  setExecutions: (executions: readonly Execution[] | ErrorState | LoadingState) => void,
  setInstantiationTxHash: (instantiationTxHash: string | undefined | ErrorState | LoadingState) => void,
) => () => {
  getAndSetContractCodeHistory(client, contractAddress, setContractCodeHistory);
  getAndSetDetails(client, contractAddress, setDetails);
  getAndSetInstantiationTxHash(client, contractAddress, setInstantiationTxHash);

  Promise.all(settings.backend.denominations.map((denom) => client.getBalance(contractAddress, denom)))
    .then((balances) => {
      const filteredBalances = balances.filter((balance): balance is Coin => balance !== null);
      setBalance(filteredBalances);
    })
    .catch(() => setBalance(errorState));

  client
    .searchTx({
      tags: makeTags(`message.contract_address=${contractAddress}&message.action=execute`),
    })
    .then((txs) => {
      const out = txs.reduce((executions: readonly Execution[], tx: IndexedTx): readonly Execution[] => {
        const decodedTx = Tx.decode(tx.tx);
        const txExecutions = (decodedTx?.body?.messages ?? [])
          .filter(isStargateMsgExecuteContract)
          .map(getExecutionFromStargateMsgExecuteContract(typeRegistry, tx));
        return [...executions, ...txExecutions];
      }, []);
      setExecutions(out);
    })
    .catch(() => setExecutions(errorState));
};

export function ContractPage(): JSX.Element {
  const { client, typeRegistry } = React.useContext(ClientContext);
  const { contractAddress: contractAddressParam } = useParams<{ readonly contractAddress: string }>();
  const contractAddress = contractAddressParam || "";

  const [details, setDetails] = React.useState<Contract | ErrorState | LoadingState>(loadingState);
  const [balance, setBalance] = React.useState<readonly ICoin[] | ErrorState | LoadingState>(loadingState);
  const [instantiationTxHash, setInstantiationTxHash] = React.useState<
    string | undefined | ErrorState | LoadingState
  >(loadingState);
  const [contractCodeHistory, setContractCodeHistory] = React.useState<readonly ContractCodeHistoryEntry[]>(
    [],
  );
  const [executions, setExecutions] = React.useState<readonly Execution[] | ErrorState | LoadingState>(
    loadingState,
  );

  React.useEffect(
    isStargateClient(client)
      ? stargateEffect(
          client,
          contractAddress,
          typeRegistry,
          setBalance,
          setContractCodeHistory,
          setDetails,
          setExecutions,
          setInstantiationTxHash,
        )
      : isLaunchpadClient(client)
      ? launchpadEffect(
          client,
          contractAddress,
          setBalance,
          setContractCodeHistory,
          setDetails,
          setExecutions,
          setInstantiationTxHash,
        )
      : () => {},
    [client, contractAddress, typeRegistry],
  );

  const pageTitle = <span title={contractAddress}>Contract {ellideMiddle(contractAddress, 15)}</span>;

  return (
    <div className="page">
      <Header />
      <div className="container mt-3 contract-container">
        <div className="row white-row white-row-first">
          <div className="col">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/codes">Codes</Link>
                </li>
                <li className="breadcrumb-item">
                  {isLoadingState(details) ? (
                    <span>Loading …</span>
                  ) : isErrorState(details) ? (
                    <span>Error</span>
                  ) : (
                    <CodeLink codeId={details.codeId} />
                  )}
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {pageTitle}
                </li>
              </ol>
            </nav>
          </div>
        </div>
        <div className="row white-row">
          <div className="col-12 col-md-6">
            <h1>{pageTitle}</h1>
            <ul className="list-group list-group-horizontal mb-3">
              <li className="list-group-item" title="Bank tokens owned by this contract">
                Balance:{" "}
                {isLoadingState(balance)
                  ? "Loading …"
                  : isErrorState(balance)
                  ? "Error"
                  : printableBalance(balance)}
              </li>
            </ul>
          </div>
          <div className="col-12 col-md-6">
            {isLoadingState(details) ? (
              <p>Loading …</p>
            ) : isErrorState(details) ? (
              <p>An Error occurred when loading contract</p>
            ) : (
              <>
                <InitializationInfo contract={details} instantiationTxHash={instantiationTxHash} />
                <HistoryInfo contractCodeHistory={contractCodeHistory} />
                <QueryContract contractAddress={contractAddress} />
                <ExecuteContract contractAddress={contractAddress} />
              </>
            )}
          </div>
        </div>
        <div className="row white-row white-row-last">
          <div className="col">
            <h2>Executions</h2>
            {isLoadingState(executions) ? (
              <p>Loading …</p>
            ) : isErrorState(executions) ? (
              <p>An Error occurred when loading transactions</p>
            ) : executions.length !== 0 ? (
              <ExecutionsTable executions={executions} />
            ) : (
              <p>Contract was not yet executed</p>
            )}
          </div>
        </div>

        <FooterRow />
      </div>
    </div>
  );
}
