import "./Codes.css";

import React from "react";

import { ClientContext } from "../../contexts/ClientContext";
import {
  ErrorState,
  errorState,
  isErrorState,
  isLoadingState,
  LoadingState,
  loadingState,
} from "../../ui-utils/states";
import { Code, CodeData } from "./Code";

interface LoadedCode {
  readonly source: string;
  readonly data: CodeData;
}

function codeKey(code: LoadedCode): string {
  return `${code.source}__${code.data.codeId}`;
}

export function Codes(): JSX.Element {
  const { client, nodeUrl } = React.useContext(ClientContext);
  const [codes, setCodes] = React.useState<readonly LoadedCode[] | ErrorState | LoadingState>(loadingState);

  React.useEffect(() => {
    client
      ?.getCodes()
      .then((codeInfos) => {
        const processed = codeInfos
          .map(
            (response): LoadedCode => ({
              source: nodeUrl,
              data: {
                codeId: response.id,
                checksum: response.checksum,
                creator: response.creator,
              },
            }),
          )
          .reverse();
        setCodes(processed);
      })
      .catch(() => setCodes(errorState));
  }, [client, nodeUrl]);

  // Display codes vertically on small devices and in a flex container on large and above
  return (
    <div className="d-lg-flex flex-wrap">
      {isLoadingState(codes) ? (
        <p>Loading …</p>
      ) : isErrorState(codes) ? (
        <p>Error loading codes</p>
      ) : codes.length === 0 ? (
        <p>No code uploaded yet</p>
      ) : (
        codes.map((code, index) => <Code data={code.data} index={index} key={codeKey(code)} />)
      )}
    </div>
  );
}
