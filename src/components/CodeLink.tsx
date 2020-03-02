import React from "react";
import { Link } from "react-router-dom";

interface Props {
  readonly codeId: number;
}

export default function CodeLink({ codeId }: Props): JSX.Element {
  return <Link to={`/codes/${codeId}`}>Code #{codeId}</Link>;
}
