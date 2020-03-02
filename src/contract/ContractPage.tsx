import "./ContractPage.css";

import { CosmWasmClient, types } from "@cosmwasm/sdk";
import React from "react";
import { useParams } from "react-router-dom";

import { settings } from "../settings";
import { ellideMiddle } from "../ui-utils";

interface Execution {
  readonly transactionId: string;
  readonly msg: types.MsgExecuteContract;
}

function ContractPage(): JSX.Element {
  const { contractAddress: contractAddressParam } = useParams();
  const contractAddress = contractAddressParam || "";

  const [details, setDetails] = React.useState<any | undefined>();
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

  return (
    <div className="container mt-3 contract-container">
      <div className="row">
        <div className="col">
          <h1>
            Contract <span title={contractAddress}>{ellideMiddle(contractAddress, 15)}</span>
          </h1>
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
