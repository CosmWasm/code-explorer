import { types } from "@cosmwasm/sdk";
import React from "react";

export interface Execution {
  readonly key: string;
  readonly transactionId: string;
  readonly msg: types.MsgExecuteContract;
}

interface Props {
  readonly executions: readonly Execution[];
}

export function ExecutionsTable({ executions }: Props): JSX.Element {
  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Transaction ID</th>
          <th scope="col">Sender</th>
        </tr>
      </thead>
      <tbody>
        {executions.map((execution, index) => (
          <tr key={execution.key}>
            <th scope="row">{index + 1}</th>
            <td>{execution.transactionId}</td>
            <td>{execution.msg.value.sender}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
