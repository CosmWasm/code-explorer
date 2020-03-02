import "./CodeDetails.css";

import { CodeDetails, Contract, CosmWasmClient } from "@cosmwasm/sdk";
import React from "react";
import { useParams } from "react-router-dom";

import { settings } from "../settings";
import InstanceRow from "./InstanceRow";
import VerifyContract from "./VerifyContract";

function CodePage(): JSX.Element {
  const { codeId: codeIdParam } = useParams();
  const codeId = parseInt(codeIdParam || "0", 10);

  const [details, setDetails] = React.useState<CodeDetails | undefined>();
  const [contracts, setContracts] = React.useState<readonly Contract[]>([]);

  React.useEffect(() => {
    const client = new CosmWasmClient(settings.nodeUrl);
    client.getContracts(codeId).then(setContracts);
    client.getCodeDetails(codeId).then(setDetails);
  }, [codeId]);

  return (
    <div className="container mt-3 code-details">
      <div className="row">
        <div className="col">
          <h1>Code #{codeId}</h1>
          <ul className="list-group list-group-horizontal">
            <li className="list-group-item">Type: Wasm</li>
            <li className="list-group-item">
              Size: {details ? Math.round(details.data.length / 1024) + " KiB" : "Loading …"}
            </li>
          </ul>
        </div>
        <div className="col">
          <h2>Verification</h2>
          <p>
            Code verfication allows you to verify that uploaded code was compiled from the source it claims.{" "}
            <a href="https://github.com/confio/cosmwasm-verify">Tell me more!</a>
          </p>
          {details ? (
            <VerifyContract checksum={details.checksum} source={details.source} builder={details.builder} />
          ) : (
            <p>Loading …</p>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col">
          <h2>Instances</h2>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Label</th>
                <th scope="col">Address</th>
                <th scope="col">Creator</th>
                <th scope="col">Executions</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract, index) => (
                <InstanceRow position={index + 1} contract={contract} key={contract.address} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CodePage;
