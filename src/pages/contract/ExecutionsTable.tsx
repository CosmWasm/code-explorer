import { types } from "@cosmwasm/sdk";
import React from "react";
import { Link } from "react-router-dom";

import { ellideMiddle } from "../../ui-utils";

export interface Execution {
  readonly key: string;
  readonly height: number;
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
          <th scope="col">Height</th>
          <th scope="col">Transaction ID</th>
          <th scope="col">Sender</th>
        </tr>
      </thead>
      <tbody>
        {executions.map((execution, index) => (
          <tr key={execution.key}>
            <th scope="row">{index + 1}</th>
            <td>{execution.height}</td>
            <td>
              <Link to={`/tx/${execution.transactionId}`} title={execution.transactionId}>
                {ellideMiddle(execution.transactionId, 20)}
              </Link>
            </td>
            <td>{execution.msg.value.sender}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
