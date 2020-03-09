import { Contract } from "@cosmwasm/sdk";
import React from "react";

import { AccountLink } from "../../components/AccountLink";
import { ContractLink } from "../../components/ContractLink";
import { ClientContext } from "../../contexts/ClientContext";

interface Props {
  readonly position: number;
  readonly contract: Contract;
}

function InstanceRow({ position, contract }: Props): JSX.Element {
  const clientContext = React.useContext(ClientContext);
  const [executionCount, setExecutionCount] = React.useState<number | undefined>();

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
    clientContext.client.searchTx({ tags: tags }).then(execTxs => setExecutionCount(execTxs.length));
  }, [clientContext.client, contract.address]);

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
      <td>{executionCount === undefined ? "Loading …" : executionCount}</td>
    </tr>
  );
}

export default InstanceRow;
