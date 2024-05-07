import Navbar from '../navbar/Navbar';
import './ContactForm.css';
import { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import React from 'react';
import axios from 'axios';
import { MapPin, Phone, EnvelopeSimple, Clock } from 'phosphor-react';
import sides from '../assets/sides.png';
function ContactForm() {
  const [subject, setSubject] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post('/api/email', {
        subject,
        email,
        message,
      });
      setLoading(false);
      window.alert(data.message);
    } catch (err) {
      setLoading(false);
      window.alert(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    }
  };
  return (
    <div className="container-contact-form">
      <div className="form-contact-info">
        <div className="container-form">
          <div className="form">
            <div className="grid-txt">
              Contactează-ne! Îți vom răspunde mai repede decât zboară
              albinuțele din floare în floare! 
            </div>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '40px',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  maxWidth: 600,
                  mx: 'auto',
                  p: 2,
                  // border: '1px solid   #0000004e',
                  borderRadius: '12px',
                  // boxShadow: 1,
                }}
              >
                <Typography
                  variant="h4"
                  align="center"
                  mb={2}
                  className="typografy"
                >
                  Trimite-ne un mesaj
                </Typography>
                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Subiect"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    margin="normal"
                    required
                    InputProps={{
                      style: { backgroundColor: '#f7f3f0' } 
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    margin="normal"
                    required
                    type="email"
                    InputProps={{
                      style: { backgroundColor: '#f7f3f0' } 
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Mesaj"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    margin="normal"
                    required
                    multiline
                    rows={4}
                    InputProps={{
                      style: { backgroundColor: '#f7f3f0' } 
                    }}
                  />
                  <div className="button-submit">
                    <Button
                      disabled={loading}
                      fullWidth
                      type="submit"
                      sx={{
                        mt: 2,
                        backgroundColor: '#FFA500',
                        color: '#fff',
                        '&:hover': {
                          backgroundColor: '#52616B',
                        },
                      }}
                    >
                      {loading ? 'Sending...' : 'Trimite'}
                    </Button>
                  </div>
                </form>
              </Box>
            </Box>
          </div>
        </div>
        <div className="grid-item-program">
          {/* <img alt="home" src={sides}></img> */}
          <div className="inside-text">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <MapPin style={{color:"#FFA500",marginRight:"10px"}}size={40} />
              <h5>Adresă</h5>
            </div>

            <p style={{ fontSize: '16px' }} >Strada Viscolului numărul 12 </p>
            <p style={{marginTop:"10px",fontSize: '16px'}}>Sector 6, București </p>
            <hr style={{ marginTop: '30px' }}></hr>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Phone style={{color:"#FFA500",marginRight:"10px"}}size={40} />
              <h5 >Telefon</h5>
            </div>

            <p style={{ fontSize: '16px' }} >+1 (949) 354-2574</p>
            <p style={{marginTop:"10px",fontSize: '16px'}}>+1 (949) 354-2575</p>

            <hr style={{ marginTop: '30px' }}></hr>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <EnvelopeSimple style={{color:"#FFA500",marginRight:"10px"}} size={40} />
              <h5>Email</h5>
            </div>

            <p style={{ fontSize: '16px' }} >silohiandreea05@gmail.com</p>
            <hr style={{ marginTop: '30px' }}></hr>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Clock style={{color:"#FFA500",marginRight:"10px"}} size={40} />
              <h5>Program</h5>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between',marginTop:"20px" }}>
              <p style={{ fontSize: '16px' }} >Luni-Vineri</p>
              <p style={{ fontSize: '16px' }} >08:00-18:00</p>
            </div>
            <hr style={{ marginTop: '20px' }}></hr>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p style={{ fontSize: '16px' }} >Sâmbătă</p>
              <p style={{ fontSize: '16px' }} >08:00-16:00</p>
            </div>
            <hr style={{ marginTop: '20px' }}></hr>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p style={{ fontSize: '16px' }} >Duminică</p>
              <p style={{ fontSize: '16px' }} >Închis</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactForm;
