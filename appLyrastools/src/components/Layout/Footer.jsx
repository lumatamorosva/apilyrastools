// eslint-disable-next-line no-unused-vars
import React from "react"; 
import { Container, IconButton, Typography } from "@mui/material"; 
import Grid from "@mui/material/Grid2"; 
import Toolbar from "@mui/material/Toolbar"; 
import TranslateIcon from '@mui/icons-material/Translate';
import { useTranslation } from 'react-i18next';

export function Footer({ t, changeLanguage} = useTranslation()) { 
  return ( 
    <Toolbar 
      sx={{ 
      '@media print': { display: 'none' },
        px: 2, 
        position: "fixed", 
        bottom: 0, 
        width: "100%", 
        height: "5rem", 
        backgroundColor: "primary.main"
      }} 
    > 
      {/* Texto y botón de idioma */} 
      <Container> 
        <div style={{ justifyContent: 'space-between', alignItems: 'center', display: 'flex', marginBottom: '3px' }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <Grid size={11} padding={'1px'}> 
              <Typography align="center" alignContent={'center'} color="white">ISW-613<br/>Luis Carlos Matamoros Vargas </Typography>
              <Typography align="center" color="secondary.main" variant="body1">{`${new Date().getFullYear()}`} </Typography>  
            </Grid>
          </div>
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', marginBottom: '3px', alignItems:'right' }}>
              <img className="imageButton" src='/images/us.png' onClick={() => changeLanguage('en')} ></img>
              <img className="imageButton" src='/images/es.png' onClick={() => changeLanguage('es')}></img>
            </div>
          </div>
        </div>
      </Container> 
    </Toolbar> 
  ); 
} 
