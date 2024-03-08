import React from "react";
import { SpinnerGap } from "phosphor-react";
export default function LoadingBox() {
  return (
    <div style={{ display: "flex", justifyContent: "center" ,width:"100%"}}>
    <SpinnerGap
      animation="border"
      role="status"
      
    >
      <span className="visually-hidden">Loading...</span>
    </SpinnerGap>
    </div>
  );
}
