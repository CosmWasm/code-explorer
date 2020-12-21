import { ExecuteResult } from "@cosmjs/cosmwasm";
import { Coin } from "@cosmjs/launchpad";
import React from "react";
import JSONInput from "react-json-editor-ajrm";

import { settings } from "../../settings";
import {
  disableLedgerLogin,
  getSigningClient,
  loadLedgerWallet,
  loadOrCreateWallet,
  WalletLoader,
} from "../../ui-utils/clients";
import { jsonInputStyle } from "../../ui-utils/jsonInput";
import { Result } from "./ContractPage";

interface Props {
  readonly contractAddress: string;
}

export function ExecuteContract({ contractAddress }: Props): JSX.Element {
  const [executing, setExecuting] = React.useState(false);
  const [error, setError] = React.useState<string>();

  const [memo, setMemo] = React.useState<string>();

  const [msgObject, setMsgObject] = React.useState<Result<Record<string, any>>>();
  const [coinsObject, setCoinsObject] = React.useState<Result<ReadonlyArray<Coin>>>();

  const [executeResponse, setExecuteResponse] = React.useState<Result<ExecuteResult>>();

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

  async function executeContract(loadWallet: WalletLoader): Promise<void> {
    if (!msgObject?.result) return;

    setExecuting(true);

    try {
      const client = await getSigningClient(loadWallet);
      const executeResponseResult: ExecuteResult = await client.execute(
        contractAddress,
        msgObject.result,
        memo,
        coinsObject?.result,
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
          <span title="The contract query input">Execute contract:</span>
        </li>
        <li className="list-group-item d-flex align-items-baseline">
          <JSONInput
            width="100%"
            height="200px"
            placeholder={{
              transfer: { recipient: "cosmos1zk4hr47hlch274x28j32dgnhuyewqjrwxn4mvm", amount: "1" },
            }}
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
            // eslint-disable-next-line @typescript-eslint/camelcase
            placeholder={[{ denom: settings.backend.denominations[0], amount: "1" }]}
            confirmGood={false}
            style={jsonInputStyle}
            onChange={({ jsObject }: any) => setCoinsObject({ result: jsObject })}
          />
        </li>
        <li className="list-group-item d-flex align-items-baseline">
          <span title="The contract query input">Memo:</span>
          <input
            className="ml-3 flex-grow-1"
            value={memo}
            onChange={(event) => setMemo(event.target.value)}
          />
        </li>
        <div className="list-group-item btn-group">
          {executing ? (
            <button className="btn btn-primary" type="button" disabled>
              <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
              Executing...
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary dropdown-toggle"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              disabled={!msgObject?.result || settings.backend.stargateEnabled}
            >
              Execute contract
            </button>
          )}
          <div className="dropdown-menu">
            <h6 className="dropdown-header">with</h6>
            <button
              className="dropdown-item"
              onClick={() => {
                executeContract(loadOrCreateWallet);
              }}
            >
              Browser wallet
            </button>
            <button
              className="dropdown-item"
              onClick={() => {
                executeContract(loadLedgerWallet);
              }}
              disabled={disableLedgerLogin()}
            >
              Ledger wallet
            </button>
          </div>
        </div>
        {executeResponse?.result ? (
          <li className="list-group-item">
            <span title="The contract formatted input">Response:</span>
            <pre className="mb-0">{executeResponse.result}</pre>
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
