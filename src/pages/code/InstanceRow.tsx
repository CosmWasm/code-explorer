import { Contract } from "@cosmjs/cosmwasm-launchpad"; // https://github.com/cosmos/cosmjs/pull/790
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
  readonly contract: Contract;
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
        value: contract.address,
      },
      {
        key: "message.action",
        value: "execute",
      },
    ];
    (client?.searchTx({ tags: tags }) as Promise<ReadonlyArray<{ readonly hash: string }>>)
      .then((execTxs) => setExecutionCount(execTxs.length))
      .catch(() => setExecutionCount(errorState));
  }, [client, contract.address]);

  return (
    <tr>
      <th scope="row">{position}</th>
      <td>{contract.label}</td>
      <td>
        <ContractLink address={contract.address} />
      </td>
      <td>
        <AccountLink address={contract.creator} />
      </td>
      <td>{contract.admin ? <AccountLink address={contract.admin} /> : "–"}</td>
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
