import React from "react";

interface Props {
  readonly endpoint: string;
}

const separatorStyle: React.CSSProperties = {
  borderColor: "rgba(255, 255, 255, 0.8)",
};
const whiteText = { color: "#f0f0f0" };

/** Place me as a row in a container */
export function FooterRow({ endpoint }: Props): JSX.Element {
  return (
    <div className="row">
      <div className="col">
        <hr style={separatorStyle} />
        <p style={whiteText} className="text-center font-weight-light">
          Connected to endpoint {endpoint} |{" "}
          <a href="https://github.com/confio/code-explorer" style={whiteText}>
            Fork me on GitHub
          </a>
        </p>
      </div>
    </div>
  );
}
