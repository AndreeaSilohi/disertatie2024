import * as React from "react";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { Facebook, Instagram, Twitter } from "@mui/icons-material";

function Footer() {
  return (
    <div
      className="row"
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "0px 100px",
        backgroundColor: "#f3f4ec", 
        color: "#FFFFFF", 
      }}
    >
      <div className="col-md-4">
        <Typography variant="h6" color="text.primary" gutterBottom>
          About Us
        </Typography>
        <Typography variant="body2" color="text.secondary">
          We are XYZ company, dedicated to providing the best service to our
          customers.
        </Typography>
      </div>
      <div className="col-md-4">
        <Typography variant="h6" color="text.primary" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="body2" color="text.secondary">
          123 Main Street, Anytown, USA
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Email: info@example.com
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Phone: +1 234 567 8901
        </Typography>
      </div>
      <div className="col-md-4">
        <Typography variant="h6" color="text.primary" gutterBottom>
          Follow Us
        </Typography>
        <Link href="https://www.facebook.com/" color="inherit">
          <Facebook />
        </Link>
        <Link
          href="https://www.instagram.com/"
          color="inherit"
          sx={{ pl: 1, pr: 1 }}
        >
          <Instagram />
        </Link>
        <Link href="https://www.twitter.com/" color="inherit">
          <Twitter />
        </Link>
      </div>
    </div>
  );
}

export default Footer;
