import "./CodeDetails.css";

import { Contract, CosmWasmClient } from "@cosmwasm/sdk";
import React from "react";
import { useParams } from "react-router-dom";

import { settings } from "../settings";

function CodePage(): JSX.Element {
  const { codeId: codeIdParam } = useParams();
  const codeId = parseInt(codeIdParam || "0", 10);

  const [contracts, setContracts] = React.useState<readonly Contract[]>([]);

  React.useEffect(() => {
    const client = new CosmWasmClient(settings.nodeUrl);
    client.getContracts(codeId).then(setContracts);
  }, [codeId]);

  return (
    <div className="container">
      <div className="code-details">
        <h1>Code #{codeId}</h1>
        <h2>Instances</h2>

        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Label</th>
              <th scope="col">Address</th>
              <th scope="col">Creator</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((contract, index) => (
              <tr>
                <th scope="row">{index + 1}</th>
                <td>{contract.label}</td>
                <td>{contract.address}</td>
                <td>{contract.creator}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CodePage;
