import React from "react";

import { FooterRow } from "../components/FooterRow";
import { settings } from "../settings";
import { Codes } from "./Codes";

export default function CodeslistPage(): JSX.Element {
  return (
    <div className="container mt-3">
      <Codes />
      <FooterRow endpoint={settings.nodeUrl} />
    </div>
  );
}
