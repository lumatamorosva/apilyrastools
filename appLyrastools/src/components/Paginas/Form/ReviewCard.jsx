import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { useTranslation } from 'react-i18next';

ReviewCard.propTypes = {data: PropTypes.array,field: PropTypes.object};
      
export function ReviewCard({data}) {
    //Para la traducción
    const { t } = useTranslation();
    //Traer nombre de los productos:
      const [prod, setProd] = useState([]);
      useEffect(() =>{fetch(`http://localhost:81/apilyrastools/producto`)
        .then((res) => res.json())
        .then(data => setProd(data));
      },[]);
      const obtenerNombre = (id) => {const producto = prod.find (p => p.IdProducto === id);
        return producto ? producto.NombreProducto : t('review.cargando');
      }

  //Traer nombre del cliente:
      const [client, setClient] = useState([]);
      useEffect(() =>{fetch(`http://localhost:81/apilyrastools/user`)
        .then((res) => res.json())
        .then(data => setClient(data));
      },[]);
      const obtenerNombreCliente = (id) => {const cliente = client.find(p => p.IdUsuario === id);
        return cliente ? cliente.Nombre : t('review.cargando');
      }

  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="body1" fontWeight={"bold"} align="center"> {obtenerNombre(data.IdProducto)}</Typography>
          <Typography variant="body1" color="text.primary"> {data.Opinion}</Typography>
          <Box display="flex">
            <Box>{[...Array(Math.round(Number(data.Calificacion)))].map((_, i) => (
                <ThumbUpAltIcon key={'filled-' + i} sx={{ color: '#2196F3' }}/>))}
                {[...Array(Math.round(5 - Number(data.Calificacion)))].map((_, i) => (
                <ThumbUpOffAltIcon key={'empty-' + i} sx={{ color: '#2196F3' }} />))}
            </Box>
          </Box>
            <Typography variant="caption" color="text.primary"> {t('review.comentario') + obtenerNombreCliente(data.IdCliente)}</Typography>
            <br /><Typography variant="caption" color="text.primary"> {t('review.fecha') + data.Fecha}</Typography>
        </CardContent>
      </Card>
    </>
  );
}