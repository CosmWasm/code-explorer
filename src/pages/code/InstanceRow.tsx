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
  const [contract, setContractInfo] = React.useState<Contract | ErrorState | LoadingState>(loadingState);

  React.useEffect(() => {
    (client?.getContract(address) as Promise<Contract>)
      .then((execTxs) => setContractInfo(execTxs))
      .catch(() => setContractInfo(errorState));
  }, [client, address]);

  return isLoadingState(contract) ? (
    <tr>
      <td>Loading ...</td>
    </tr>
  ) : isErrorState(contract) ? (
    <tr>
      <td>Error</td>
    </tr>
  ) : (
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
    </tr>
  );
}

export default InstanceRow;
