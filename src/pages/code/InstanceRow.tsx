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
  const [contractInfo, setContractInfo] = React.useState<Contract | ErrorState | LoadingState>(
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

    (client?.getContract(contract) as Promise<Contract>)
        .then((execTxs) => setContractInfo(execTxs))
        .catch(() => setContractInfo(errorState));
  }, [client, contract]);

  return isLoadingState(contractInfo) 
    ? (<tr><td>Loading ...</td></tr>) 
    : isErrorState(contractInfo)
    ? (<tr><td>Error ...</td></tr>) 
    : (
    <tr>
      <th scope="row">{position}</th>
      <td>{contractInfo.label}</td>
      <td>
      <ContractLink address={contractInfo.address} />
      </td>
      <td>
        <AccountLink address={contractInfo.creator} />
      </td>
      <td>{contractInfo.admin ? <AccountLink address={contractInfo.admin} /> : "–"}</td>
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
