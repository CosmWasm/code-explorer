import "./CodePage.css";

import { CodeDetails, Contract, CosmWasmClient } from "@cosmwasm/sdk";
import React from "react";
import { Link, useParams } from "react-router-dom";

import { FooterRow } from "../../components/FooterRow";
import { Header } from "../../components/Header";
import { settings } from "../../settings";
import InstanceRow from "./InstanceRow";
import VerifyContract from "./VerifyContract";

export function CodePage(): JSX.Element {
  const { codeId: codeIdParam } = useParams();
  const codeId = parseInt(codeIdParam || "0", 10);

  const [details, setDetails] = React.useState<CodeDetails | undefined>();
  const [contracts, setContracts] = React.useState<readonly Contract[]>([]);

  React.useEffect(() => {
    const client = new CosmWasmClient(settings.backend.nodeUrl);
    client.getContracts(codeId).then(setContracts);
    client.getCodeDetails(codeId).then(setDetails);
  }, [codeId]);

  const pageTitle = <span>Code #{codeId}</span>;

  return (
    <div className="page">
      <Header />
      <div className="container mt-3">
        <div className="row white-row white-row-first">
          <div className="col">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/codes">Codes</Link>
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
            <p>
              {details ? (
                <VerifyContract
                  checksum={details.checksum}
                  source={details.source}
                  builder={details.builder}
                />
              ) : (
                <span>Loading …</span>
              )}
            </p>
          </div>
        </div>
        <div className="row white-row white-row-last">
          <div className="col">
            <h2>Instances</h2>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Label</th>
                  <th scope="col">Contract</th>
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
        <FooterRow backend={settings.backend} />
      </div>
    </div>
  );
}
