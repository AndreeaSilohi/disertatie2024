import React from "react";
import { Grid, Typography } from "@mui/material";
import "./CheckoutSteps.css"; // Import the CSS file

const CheckoutSteps = (props) => {
  return (
    <Grid  >
      <div className="checkout-steps">
        <div>
          <StepItem className="step" label="Logare" active={props.step1} />
        </div>
        <div>
          <StepItem className="step" label="Detalii livrare" active={props.step2} />
        </div>
        <div>
          <StepItem className="step" label="Metodă plată" active={props.step3} />
        </div>
        <div>
          <StepItem className="step" label="Rezumat" active={props.step4} />
        </div>
      </div>
    </Grid>
  );
};

const StepItem = ({ label, active }) => {
  return (
    <Grid item>
      <Typography
        variant="body1"
        className={`step-item ${active ? "active-step" : ""}`}
      >
        {label}
      </Typography>
    </Grid>
  );
};

export default CheckoutSteps;
