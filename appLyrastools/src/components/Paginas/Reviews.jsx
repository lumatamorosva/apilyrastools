import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';


export function Reviews() {
  //Url para acceder a la imagenes guardadas en el API
  const BASE_URL = import.meta.env.VITE_BASE_URL + 'uploads';
  //Traer las opiniones:
      const [opiniones, setOpiniones] = useState([]);
      useEffect(() =>{
      fetch(`http://localhost:81/apilyrastools/opiniones`)
              .then((res) => res.json())
              .then(data => setOpiniones(data));
      },[]);

  //Traer nombre de los productos:
      const [prod, setProd] = useState([]);
      useEffect(() =>{
      fetch(`http://localhost:81/apilyrastools/producto`)
              .then((res) => res.json())
              .then(data => setProd(data));
      },[]);
      const obtenerNombre = (id) => {
        const producto = prod.find (p => p.IdProducto === id);
        return producto ? producto.NombreProducto : 'No encontrado';
      }

  //Traer nombre del cliente:
      const [client, setClient] = useState([]);
      useEffect(() =>{
      fetch(`http://localhost:81/apilyrastools/user`)
              .then((res) => res.json())
              .then(data => setClient(data));
      },[]);
      const obtenerNombreCliente = (id) => {
        const cliente = client.find(p => p.IdUsuario === id);
        return cliente ? cliente.Nombre : 'No encontrado';
      }

  return (
    <>
    <Grid row size={12}>
        <Grid size={8} container sx={{ p: 2 }} spacing={3}>
        {/* ()=>{} */}
        {opiniones.map((item) => (
          <Grid size={4} key={item.id} minWidth='180px'>
            <Card>
              <CardContent>
                  <Typography variant="body1" color="text.primary" align="center"> {obtenerNombre(item.IdProducto)}</Typography>
                  <Typography variant="body2" color="text.primary"> {item.Opinion}</Typography>
                  <Box display="flex">
                    <Box>
                      {[...Array(Math.round(Number(item.Calificacion)))].map((_, i) => (
                        <ThumbUpAltIcon key={'filled-' + i} sx={{ color: '#2196F3' }} />
                      ))}
                      {[...Array(Math.round(5 - Number(item.Calificacion)))].map((_, i) => (
                        <ThumbUpOffAltIcon key={'empty-' + i} sx={{ color: '#2196F3' }} />
                      ))}
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.primary"> {"Comentario por: " + obtenerNombreCliente(item.IdCliente)}</Typography>
                </CardContent>
              </Card>
            </Grid>
        ))}
      </Grid>
    </Grid>
    </>
  );
}
