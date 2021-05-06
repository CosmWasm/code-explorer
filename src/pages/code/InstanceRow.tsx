import { Contract } from "@cosmjs/cosmwasm-stargate";
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
  readonly address: string;
}

function InstanceRow({ position, address }: Props): JSX.Element {
  const { client } = React.useContext(ClientContext);
  const [executionCount, setExecutionCount] = React.useState<number | ErrorState | LoadingState>(
    loadingState,
  );
  const [contract, setContract] = React.useState<Contract>();

  React.useEffect(() => {
    client?.getContract(address).then((contract) => {
      setContract(contract);
    });
    const tags = [
      {
        key: "message.contract_address",
        value: address,
      },
      {
        key: "message.action",
        value: "execute",
      },
    ];
    (client?.searchTx({ tags: tags }) as Promise<ReadonlyArray<{ readonly hash: string }>>)
      .then((execTxs) => setExecutionCount(execTxs.length))
      .catch(() => setExecutionCount(errorState));
  }, [client, address]);

  return (
    <tr>
      <th scope="row">{position}</th>
      <td>{contract?.label || "Loading …"}</td>
      <td>
        <ContractLink address={address} />
      </td>
      <td>{contract ? <AccountLink address={contract.creator} /> : "Loading …"}</td>
      <td>{contract ? contract.admin ? <AccountLink address={contract.admin} /> : "–" : "Loading …"}</td>
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
