import { ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import { Coin } from "@cosmjs/stargate";
import React from "react";
import JSONInput from "react-json-editor-ajrm";

import { ClientContext } from "../../contexts/ClientContext";
import { settings } from "../../settings";
import { jsonInputStyle } from "../../ui-utils/jsonInput";
import { Result } from "./ContractPage";

const executePlaceholder = {
  name: "Nation coin",
  symbol: "NTN",
  decimals: 6,
};

const coinsPlaceholder = [{ denom: settings.backend.denominations[0], amount: "1" }];

interface Props {
  readonly codeId: number;
}

export function InstantiationContract({ codeId }: Props): JSX.Element {
  const { userAddress, signingClient } = React.useContext(ClientContext);

  const [executing, setExecuting] = React.useState(false);
  const [error, setError] = React.useState<string>();

  const [memo, setMemo] = React.useState<string>();
  const [label, setLabel] = React.useState<string>();

  const [msgObject, setMsgObject] = React.useState<Result<Record<string, any>>>();
  const [coinsObject, setCoinsObject] = React.useState<Result<ReadonlyArray<Coin>>>();

  const [executeResponse, setExecuteResponse] = React.useState<Result<ExecuteResult>>();

  React.useEffect(() => {
    setMsgObject({ result: executePlaceholder });
    setCoinsObject({ result: coinsPlaceholder });
  }, []);

  React.useEffect(() => {
    if (msgObject?.error) {
      setError(msgObject.error);
      return;
    }

    if (executeResponse?.error) {
      setError(executeResponse.error);
      return;
    }

    if (coinsObject?.error) {
      setError(coinsObject.error);
      return;
    }

    setError(undefined);
  }, [coinsObject, executeResponse, msgObject]);

  async function executeContract(): Promise<void> {
    if (!msgObject?.result || !userAddress || !label || !signingClient) return;

    setExecuting(true);

    try {
      const executeResponseResult: ExecuteResult = await signingClient.instantiate(
        userAddress,
        codeId,
        msgObject.result,
        label,
        {
          memo: memo,
          transferAmount: coinsObject?.result,
        },
      );
      setExecuteResponse({ result: executeResponseResult });
    } catch (error) {
      setExecuteResponse({ error: `Execute error: ${error.message}` });
    }

    setExecuting(false);
  }

  return (
    <div className="card mb-3">
      <ul className="list-group list-group-flush">
        <li className="list-group-item d-flex align-items-baseline">
          <span title="The contract query input">Instantiate contract:</span>
        </li>
        <li className="list-group-item d-flex align-items-baseline">
          <JSONInput
            width="100%"
            height="200px"
            placeholder={executePlaceholder}
            confirmGood={false}
            style={jsonInputStyle}
            onChange={({ jsObject }: any) => setMsgObject({ result: jsObject })}
          />
        </li>
        <li className="list-group-item d-flex align-items-baseline">
          <span title="The contract query input">Coins to transfer:</span>
        </li>
        <li className="list-group-item d-flex align-items-baseline">
          <JSONInput
            width="100%"
            height="120px"
            placeholder={coinsPlaceholder}
            confirmGood={false}
            style={jsonInputStyle}
            onChange={({ jsObject }: any) => setCoinsObject({ result: jsObject })}
          />
        </li>
        <li className="list-group-item d-flex align-items-baseline">
          <div className="form-group row flex-grow-1">
            <label className="col-sm-2 col-form-label">Label</label>
            <div className="col-sm-10">
              <input
                className="form-control"
                value={label}
                onChange={(event) => setLabel(event.target.value)}
              />
            </div>
          </div>
        </li>
        <li className="list-group-item d-flex align-items-baseline">
          <div className="form-group row flex-grow-1">
            <label className="col-sm-2 col-form-label">Memo</label>
            <div className="col-sm-10">
              <input
                className="form-control"
                value={memo}
                onChange={(event) => setMemo(event.target.value)}
              />
            </div>
          </div>
        </li>
        <div className="list-group-item btn-group">
          {executing ? (
            <button className="btn btn-primary" type="button" disabled>
              <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
              Executing...
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={executeContract}
              disabled={!msgObject?.result || !signingClient}
            >
              Instantiate contract
            </button>
          )}
        </div>
        {executeResponse?.result ? (
          <li className="list-group-item">
            <span title="The contract formatted input">Response:</span>
            <pre className="mb-0">{JSON.stringify(executeResponse.result, undefined, "  ")}</pre>
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
