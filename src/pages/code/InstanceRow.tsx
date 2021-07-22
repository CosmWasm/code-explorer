import { Contract } from "@cosmjs/cosmwasm-launchpad";
import React from "react";

import { AccountLink } from "../../components/AccountLink";
import { ContractLink } from "../../components/ContractLink";
import { ClientContext } from "../../contexts/ClientContext";
import {
  ErrorState,
  errorState,
  isErrorState,
  isLoadingState,
  LoadingState,
  loadingState,
} from "../../ui-utils/states";

interface Props {
  readonly position: number;
  readonly contract: string;
}

function InstanceRow({ position, contract }: Props): JSX.Element {
  const { client } = React.useContext(ClientContext);
  const [executionCount, setExecutionCount] = React.useState<number | ErrorState | LoadingState>(
    loadingState,
  );

  React.useEffect(() => {
    const tags = [
      {
        key: "message.contract_address",
        value: contract,
      },
      {
        key: "message.action",
        value: "execute",
      },
    ];
    (client?.searchTx({ tags: tags }) as Promise<ReadonlyArray<{ readonly hash: string }>>)
      .then((execTxs) => setExecutionCount(execTxs.length))
      .catch(() => setExecutionCount(errorState));
  }, [client, contract]);

  return (
    <tr>
      <th scope="row">{position}</th>
      <td>{"-"}</td>
      <td>
      <ContractLink address={contract} />
      </td>
      <td>
        <AccountLink address={"-"} />
      </td>
      <td>{"–"}</td>
      <td>
        {isLoadingState(executionCount)
          ? "Loading …"
          : isErrorState(executionCount)
          ? "Error"
          : executionCount}
      </td>
    </tr>
  );
}

export default InstanceRow;
