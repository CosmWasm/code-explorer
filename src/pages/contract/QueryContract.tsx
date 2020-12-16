import React from "react";

import { ClientContext } from "../../contexts/ClientContext";
import { Result } from "./ContractPage";

interface Props {
  readonly contractAddress: string;
}

export function QueryContract({ contractAddress }: Props): JSX.Element {
  const clientContext = React.useContext(ClientContext);

  const [error, setError] = React.useState<string>();
  const [queryInput, setQueryInput] = React.useState<string>();
  const [queryObject, setQueryObject] = React.useState<Result<Record<string, any>>>();
  const [queryResponse, setQueryResponse] = React.useState<Result<string>>();

  React.useEffect(() => {
    if (queryInput && queryObject?.error) {
      setError(queryObject.error);
      return;
    }

    if (queryResponse?.error) {
      setError(queryResponse.error);
      return;
    }

    setError(undefined);
  }, [queryInput, queryObject, queryResponse]);

  React.useEffect(() => {
    setQueryResponse({});

    try {
      const queryObjectResult = JSON.parse(queryInput || "");
      setQueryObject({ result: queryObjectResult });
    } catch (error) {
      setQueryObject({ error: `Invalid JSON: ${error.message}` });
    }
  }, [queryInput, setQueryObject]);

  async function runQuery(): Promise<void> {
    if (!queryObject?.result) return;

    try {
      const queryResponseResult: Record<string, any> = await clientContext.client.queryContractSmart(
        contractAddress,
        queryObject.result,
      );

      const formattedResult = JSON.stringify(queryResponseResult, null, "  ");
      setQueryResponse({ result: formattedResult });
    } catch (error) {
      setQueryResponse({ error: `Query error: ${error.message}` });
    }
  }

  return (
    <div className="card mb-3">
      <ul className="list-group list-group-flush">
        <li className="list-group-item d-flex align-items-baseline">
          <span title="The contract query input">Query contract:</span>
          <input
            className="ml-3 flex-grow-1"
            value={queryInput}
            onChange={(event) => setQueryInput(event.target.value)}
          />
        </li>
        {queryObject?.result ? (
          <>
            <li className="list-group-item">
              <span title="The contract formatted input">Formatted query:</span>
              <pre className="mt-2 mb-3">{JSON.stringify(queryObject.result, null, "  ")}</pre>
            </li>
            <li className="list-group-item">
              <button className="btn btn-primary" onClick={runQuery} disabled={!!error}>
                Run query
              </button>
            </li>
          </>
        ) : null}
        {queryResponse?.result ? (
          <li className="list-group-item">
            <span title="The contract formatted input">Response:</span>
            <pre className="mb-0">{queryResponse.result}</pre>
          </li>
        ) : null}
        {error ? (
          <li className="list-group-item">
            <span className="text-danger" title="The contract query error">
              {error}
            </span>
          </li>
        ) : null}
      </ul>
    </div>
  );
}
