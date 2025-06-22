// eslint-disable-next-line no-unused-vars
import React from "react"; 
import { Container, IconButton, Typography } from "@mui/material"; 
import Grid from "@mui/material/Grid2"; 
import Toolbar from "@mui/material/Toolbar"; 
import TranslateIcon from '@mui/icons-material/Translate';
export function Footer() { 
  return ( 
    <Toolbar 
      sx={{ 
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
        <Grid container padding={'5px'}> 
          <Grid size={11} padding={'1px'}> 
            <Typography align="center" alignContent={'center'} color="white">ISW-613<br/>Luis Carlos Matamoros Vargas </Typography> 
          </Grid>
          <Grid size={11} marginBottom={"0px"}> 
            <Typography align="center" color="secondary.main" variant="body1">{`${new Date().getFullYear()}`} </Typography> 
          </Grid>
          <Grid size={1} marginTop={"-30px"}>
            <IconButton onClick><TranslateIcon  sx={{color:"white"}}/></IconButton>
          </Grid>
        </Grid> 
      </Container> 
    </Toolbar> 
  ); 
} 
