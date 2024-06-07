import React from 'react';
import { Box, Container, Grid, Typography, IconButton } from '@mui/material';
import { FacebookLogo, InstagramLogo, TiktokLogo } from 'phosphor-react';

function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: '#333',
        color: '#fff',
        py: 6,
        boxShadow: '0px -4px 5px #808080',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5} >
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ width: '320px' }} gutterBottom>
              Despre noi
            </Typography>
            <Typography variant="body2" sx={{ width: '320px' }}>
              Noi suntem Honey Boutique și suntem dedicați pentru a oferi cele
              mai bune produse clienților noștri.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Contactează-ne
            </Typography>
            <Typography variant="body2">
              Strada Victoriei, nr. 160, Curtea de Argeș
            </Typography>
            <Typography variant="body2">Email: info@example.com</Typography>
            <Typography variant="body2">Phone: +40725219542</Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center'}}>
            <Typography variant="h6" gutterBottom sx={{ width: '320px'}}>
              Urmărește-ne și pe social media
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 2,
                margin: '0px',
              }}
            >
              <IconButton
                href="https://www.facebook.com/"
                sx={{ color: '#fff', mx: 1 }}
              >
                <FacebookLogo />
              </IconButton>
              <IconButton
                href="https://www.instagram.com/"
                sx={{ color: '#fff', mx: 1 }}
              >
                <InstagramLogo />
              </IconButton>
              <IconButton
                href="https://www.tiktok.com/"
                sx={{ color: '#fff', mx: 1 }}
              >
                <TiktokLogo />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2">
            © {new Date().getFullYear()} Honey Boutique. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
