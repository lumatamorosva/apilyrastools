import React, { useContext, useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Slider from 'react-slick';
import { Card, CardContent, Typography } from '@mui/material';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import CardMedia from '@mui/material/CardMedia';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import Box from '@mui/material/Box';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import CardActionArea from '@mui/material/CardActionArea';


export function Home() { 
  //Para la imagen
  const BASE_URL = import.meta.env.VITE_BASE_URL + 'uploads';
  //Tarer los prooductos
    const [prods, setProds] = useState([]);
      useEffect(() =>{
      fetch(`http://localhost:81/apilyrastools/producto/getTop10`)
              .then((res) => res.json())
              .then(data => setProds(data));
      },[]);
  //Para el carusel de productos
  const settings = {dots: true,infinite: true,speed: 500,slidesToShow: 1,slidesToScroll: 1};

  return (
    <Container sx={{ p: 2 }} maxWidth="sm"> 
      <img src="/images/logo.png" alt="logo" style={{ display: 'block', margin: '0 auto' }}/>
      <Typography variant="h5" align="center" color="text.secondary"> 
        Todo en Calidad y variedad de herramientas para tus proyectos industriales o residenciales. 
      </Typography> 
      <Typography variant="h6"> Top 10 mejor calificados:</Typography> 
      <Slider {...settings} >
        {prods.map((item) => (
          <div key={item.IdProducto}>
            <Card sx={{ m: 2 }}>
              <CardActionArea onClick={() => window.location.href = "/catalog-productos/"}> 
              <CardContent>
                <Typography variant="h6">{item.NombreProducto}</Typography>
                <CardMedia height="180px" component="img" image={`${BASE_URL}/${item?.Imagen}`} alt={item.Imagen} sx={{width: '100%', objectFit: 'contain'}}/>
                <Box display="flex">
                    <Box>
                      {[...Array(Math.round(Number(item.Calificacion)))].map((_, i) => (
                        <ThumbUpAltIcon key={'filled-' + i} sx={{ color: '#2196F3' }} />
                      ))}
                      {[...Array(Math.round(5 - Number(item.Calificacion)))].map((_, i) => (
                        <ThumbUpOffAltIcon key={'empty-' + i} sx={{ color: '#2196F3' }} />
                      ))}
                    </Box>
                    <Box marginLeft='auto'>
                      <Typography variant="body2" color="text.primary">
                        <PointOfSaleIcon sx={{ verticalAlign: 'middle' }}/>₡{Number(item.Precio).toLocaleString('en-US')}
                      </Typography>
                    </Box>
                  </Box>
              </CardContent>
              </CardActionArea>
            </Card>
          </div>
        ))}
      </Slider>
    </Container>
  ); 
} 