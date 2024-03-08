import React from "react";
import Alert from "@mui/material/Alert";
export default function MessageBox(props) {
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    alignItems:"center",
    height: "100vh"
  };
  const alertStyle = {
    width: "50%", 
    fontSize: "1.5rem", 
    display:"flex",
    justifyContent:"center"
  };
  return (
    <div style={containerStyle}>
      <Alert style={alertStyle} severity={props.severity || "info"}>{props.children}</Alert>
    </div>
  );
}
