import React, { useEffect, useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';

ReviewCard.propTypes = {
  data: PropTypes.array,
  field: PropTypes.object,
};
      
export function ReviewCard({data}) {
    //Traer nombre de los productos:
      const [prod, setProd] = useState([]);
      useEffect(() =>{
      fetch(`http://localhost:81/apilyrastools/producto`)
              .then((res) => res.json())
              .then(data => setProd(data));
      },[]);
      const obtenerNombre = (id) => {
        const producto = prod.find (p => p.IdProducto === id);
        return producto ? producto.NombreProducto : 'Buscando...';
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
        return cliente ? cliente.Nombre : 'Buscando...';
      }

  return (
    <>
            <Card>
              <CardContent>
                  <Typography variant="body1" fontWeight={"bold"} align="center"> {obtenerNombre(data.IdProducto)}</Typography>
                  <Typography variant="body1" color="text.primary"> {data.Opinion}</Typography>
                  <Box display="flex">
                    <Box>
                      {[...Array(Math.round(Number(data.Calificacion)))].map((_, i) => (
                        <ThumbUpAltIcon key={'filled-' + i} sx={{ color: '#2196F3' }} />
                      ))}
                      {[...Array(Math.round(5 - Number(data.Calificacion)))].map((_, i) => (
                        <ThumbUpOffAltIcon key={'empty-' + i} sx={{ color: '#2196F3' }} />
                      ))}
                    </Box>
                  </Box>
                  <Typography variant="caption" color="text.primary"> {"Comentario por: " + obtenerNombreCliente(data.IdCliente)}</Typography>
                  <br /><Typography variant="caption" color="text.primary"> {"Reseñado el: " + data.Fecha}</Typography>
                </CardContent>
              </Card>
    </>
  );
}