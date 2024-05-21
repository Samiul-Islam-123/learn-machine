import * as React from 'react';
import { alpha } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
 
  const navigate = useNavigate();
 
  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: '100%',
        backgroundImage:
          theme.palette.mode === 'light'
            ? 'linear-gradient(180deg, #CEE5FD, #FFF)'
            : `linear-gradient(#02294F, ${alpha('#090E10', 0.0)})`,
        backgroundSize: '100% 50%',
        backgroundRepeat: 'no-repeat',
        py: 8,
        textAlign: 'center',
      })}
    >
      <Container maxWidth="md" style={{
        marginTop : "10%"
      }}>
        <Typography variant="h2" gutterBottom>
          Welcome to Learn Machine :)
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Explore our cutting-edge dashboard, delivering high-quality solutions tailored to your needs. Elevate your experience with top-tier features and services.
        </Typography>
        <Button variant="contained" onClick={()=>{
          navigate('/app/material')
        }} color="primary" size="large" sx={{ mt: 4 }}>
          Get Started
        </Button>
      </Container>
    </Box>
  );
}
