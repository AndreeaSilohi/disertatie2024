import Navbar from "../navbar/Navbar";
import "./ContactForm.css";
import { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import React from "react";
function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    //
  };
  return (
    <div>
      <div className="navbar">
        <Navbar />
      </div>
      <div className="container-form">
        <div className="div-img">
          <img
            className="contact-image"
            alt="text"
            src="https://cdn.pixabay.com/photo/2016/07/23/17/04/farming-1537122_1280.jpg"
          ></img>
        </div>

        <div className="form">
          <div className="grid-image">
            <div className="grid-txt">
              Contactează-Ne! Îți vom răspunde mai repede decât zboară
              albinuțele din floare în floare! Ne poți contacta și telefonic la
              numărul +4(0) 745 629 551.
            </div>
          </div>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "40px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                maxWidth: 600,
                mx: "auto",
                p: 2,
                border: "2px solid  #000000",
                borderRadius: "12px",
                boxShadow: 1,
              }}
            >
              <Typography variant="h4" align="center" mb={2}>
                Contact Us
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin="normal"
                  required
                  type="email"
                />
                <TextField
                  fullWidth
                  label="Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  margin="normal"
                  required
                  multiline
                  rows={4}
                />
                <div className="button-submit">
                  <Button
                    fullWidth
                    type="submit"
                    sx={{
                      mt: 2,
                      backgroundColor: "#064420",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "#52616B",
                      },
                    }}
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </Box>
          </Box>
        </div>
      </div>
    </div>
  );
}

export default ContactForm;
