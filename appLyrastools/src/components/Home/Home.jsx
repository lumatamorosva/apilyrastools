import React, { useContext } from 'react';
import Container from '@mui/material/Container'; 
import Typography from '@mui/material/Typography'; 



export function Home() { 
  return ( 
    <Container sx={{ p: 2 }} maxWidth="sm"> 
      <img src="/images/logo.png" alt="logo" style={{ display: 'block', margin: '0 auto' }}
/>
      <Typography 
        component="h1" 
        variant="h2" 
        align="center" 
        color="text.primary" 
        gutterBottom 
      > 
        Lyra's Tools 
        </Typography> 
      <Typography variant="h5" align="center" color="text.secondary"> 
        Todo en Calidad y variedad de herramientas para tus proyectos industriales o residenciales. 
      </Typography> 
    </Container> 
  ); 
} 