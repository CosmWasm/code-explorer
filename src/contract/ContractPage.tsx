import "./ContractPage.css";

import { ContractDetails, CosmWasmClient, types } from "@cosmwasm/sdk";
import React from "react";
import { Link, useParams } from "react-router-dom";

import CodeLink from "../components/CodeLink";
import { settings } from "../settings";
import { ellideMiddle } from "../ui-utils";

interface Execution {
  readonly transactionId: string;
  readonly msg: types.MsgExecuteContract;
}

function ContractPage(): JSX.Element {
  const { contractAddress: contractAddressParam } = useParams();
  const contractAddress = contractAddressParam || "";

  const [details, setDetails] = React.useState<ContractDetails | undefined>();
  const [executions, setExecutions] = React.useState<readonly Execution[]>([]);

  React.useEffect(() => {
    const client = new CosmWasmClient(settings.nodeUrl);
    client.getContract(contractAddress).then(setDetails);

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
        for (const msg of tx.tx.value.msg) {
          if (types.isMsgExecuteContract(msg)) {
            out.push({ msg: msg, transactionId: tx.hash });
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
    <div className="container mt-3 contract-container">
      <div className="row">
        <div className="col">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
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
      <div className="row">
        <div className="col">
          <h1>{pageTitle}</h1>
        </div>
        <div className="col">
          <h2>Init message</h2>
          <pre>
            <code>{details ? JSON.stringify(details.initMsg, null, 2) : "Loading …"}</code>
          </pre>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <h2>Executions</h2>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Transaction ID</th>
                <th scope="col">Sender</th>
              </tr>
            </thead>
            <tbody>
              {executions.map((execution, index) => (
                <tr>
                  <th scope="row">{index + 1}</th>
                  <td>{execution.transactionId}</td>
                  <td>{execution.msg.value.sender}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ContractPage;
