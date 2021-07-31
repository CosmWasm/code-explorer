import React from "react";
import ReactJson from "react-json-view";

interface Props {
    readonly src: object;
    readonly strLength?: number;
}

export function JsonView({ src, strLength }: Props): JSX.Element {
  return (
      <ReactJson
        src={src}
        name={false}
        displayDataTypes={false}
        displayObjectSize={false}
        collapseStringsAfterLength={strLength ?? 24}
        theme="twilight" 
      />
  );
}
