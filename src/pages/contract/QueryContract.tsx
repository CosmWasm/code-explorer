import React from "react";
import JSONInput from "react-json-editor-ajrm";

import { ClientContext } from "../../contexts/ClientContext";
import { Result } from "./ContractPage";

interface Props {
  readonly contractAddress: string;
}

export function QueryContract({ contractAddress }: Props): JSX.Element {
  const clientContext = React.useContext(ClientContext);

  const [error, setError] = React.useState<string>();
  const [queryObject, setQueryObject] = React.useState<Result<Record<string, any>>>();
  const [queryResponse, setQueryResponse] = React.useState<Result<string>>();

  React.useEffect(() => {
    if (queryObject?.error) {
      setError(queryObject.error);
      return;
    }

    if (queryResponse?.error) {
      setError(queryResponse.error);
      return;
    }

    setError(undefined);
  }, [queryObject, queryResponse]);

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
        </li>
        <li className="list-group-item d-flex align-items-baseline">
          <JSONInput
            width="100%"
            height="200px"
            placeholder={{ field: "value" }}
            confirmGood={false}
            /* Place error box below text box, so appearing error does not push text box down */
            style={{
              container: { display: "flex", flexDirection: "column" },
              body: { order: "1" },
              warningBox: { order: "2" },
            }}
            // @ts-ignore jsObject has no types
            onChange={({ jsObject }) => setQueryObject({ result: jsObject })}
          />
        </li>
        <li className="list-group-item">
          <button
            className="btn btn-primary"
            style={{ cursor: queryObject?.result ? "pointer" : "not-allowed" }}
            onClick={runQuery}
            disabled={!queryObject?.result}
          >
            Run query
          </button>
        </li>
        {queryResponse?.result ? (
          <li className="list-group-item">
            <span title="The query response">Response:</span>
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
