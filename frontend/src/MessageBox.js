import React from "react";
import Alert from "@mui/material/Alert";

export default function MessageBox(props) {
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
    minHeight: "10vh", 
    padding: "0 10px", 
  };
  const alertStyle = {
    width: "50%", 
    fontSize: "18px", 
    display: "flex",
    justifyContent: "center",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", 
  };

  return (
    <div style={containerStyle}>
      <Alert style={alertStyle} severity={props.severity || "info"}>
        {props.children}
      </Alert>
    </div>
  );
}
