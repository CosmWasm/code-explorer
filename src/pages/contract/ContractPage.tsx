import "./ContractPage.css";

import { Account, ContractDetails, CosmWasmClient, types } from "@cosmwasm/sdk";
import React from "react";
import { Link, useParams } from "react-router-dom";

import { CodeLink } from "../../components/CodeLink";
import { FooterRow } from "../../components/FooterRow";
import { Header } from "../../components/Header";
import { settings } from "../../settings";
import { ellideMiddle, printableBalance } from "../../ui-utils";
import { Execution, ExecutionsTable } from "./ExecutionsTable";
import { InitializationInfo } from "./InitializationInfo";

export function ContractPage(): JSX.Element {
  const { contractAddress: contractAddressParam } = useParams();
  const contractAddress = contractAddressParam || "";

  const [details, setDetails] = React.useState<ContractDetails | undefined>();
  const [account, setAccount] = React.useState<Account | undefined>();
  const [executions, setExecutions] = React.useState<readonly Execution[]>([]);

  React.useEffect(() => {
    const client = new CosmWasmClient(settings.backend.nodeUrl);
    client.getContract(contractAddress).then(setDetails);
    client.getAccount(contractAddress).then(setAccount);

    const tags = [
      {
        key: "message.contract_address",
        value: contractAddress,
      },
      {
        key: "message.action",
        value: "execute",
      },
    ];
    client.searchTx({ tags: tags }).then(execTxs => {
      const out = new Array<Execution>();
      for (const tx of execTxs) {
        for (const [index, msg] of tx.tx.value.msg.entries()) {
          if (types.isMsgExecuteContract(msg)) {
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
      setExecutions(out);
    });
  }, [contractAddress]);

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
                  {details ? <CodeLink codeId={details.codeId} /> : <span>Loading …</span>}
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
                Balance: {printableBalance(account?.balance || [])}
              </li>
            </ul>
          </div>
          <div className="col">{details ? <InitializationInfo contract={details} /> : <p>Loading …</p>}</div>
        </div>
        <div className="row white-row white-row-last">
          <div className="col">
            <h2>Executions</h2>
            {executions.length !== 0 ? (
              <ExecutionsTable executions={executions} />
            ) : (
              <p>Contract was not yet executed</p>
            )}
          </div>
        </div>

        <FooterRow backend={settings.backend} />
      </div>
    </div>
  );
}
