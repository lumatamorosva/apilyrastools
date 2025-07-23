import React from 'react';
import { useEffect, useState } from "react";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import CategoryIcon from '@mui/icons-material/Category';
import DiscountIcon from '@mui/icons-material/Discount';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import Grid from '@mui/material/Grid2';
import {ReviewCard} from './Form/ReviewCard';
import FormControl from '@mui/material/FormControl';
import { Controller} from 'react-hook-form';
import { FormHelperText } from '@mui/material';
import { useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import IconButton from "@mui/material/IconButton";

//Estilo de la ventana emergente
  const stylePopup = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: '700px',
    minWidth: '400px',
    height: '90%',
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  };

  //Traer el nombre de la marca
 function marcaDetalle(id) {
  const [nombreMarca, setNombres] = useState("");
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`http://localhost:81/apilyrastools/marca/${id}`);
        const data = await res.json();
        setNombres([data.Nombre]);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [id]);
  return (nombreMarca || "Cargando...");
}
//Traer el nombre de la categoria
 function categoriaDetalle(id) {
  const [nombreCat, setNombres] = useState("");
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`http://localhost:81/apilyrastools/categoria/${id}`);
        const data = await res.json();
        setNombres([data.Nombre]);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [id]);
  return (nombreCat || "Cargando...");
}

 //Traer las opiniones:
 export function opinionDetalle(id) {
      const [opiniones, setOpiniones] = useState([]);
      useEffect(() =>{
      fetch(`http://localhost:81/apilyrastools/opiniones/get/${id}`)
              .then((res) => res.json())
              .then(data => setOpiniones(data));
      },[id]);
      if(opiniones){
        return opiniones;
      }
    }

//Traer la promoción
 function promocionDetalle(id,precio) {
  const [promocion, setPromocion] = useState("");
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`http://localhost:81/apilyrastools/promocion/${id}`);
        const data = await res.json();
        setPromocion([data.Cantidad]);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [id]);
  return (precio-((promocion/100)*precio) || "Cargando...");
}

  export default function Emergente({ open, onClose, item, BASE_URL }) {
  if (!item) return null;
    const {control} = useForm({});
    const opiniones1 = opinionDetalle(item.IdProducto);
    console.log("Estas son las opiniones: ", (opiniones1));
  return (
    <Modal open={open} onClose={onClose} aria-describedby="modal-descripcion" >
      <Box sx={stylePopup}>
        <Box display="flex" gap="10px">
          <Box width={'50%'}>
            <Typography id="modal-titulo" variant="h6" component="h2" gutterBottom>{item.NombreProducto} </Typography>
            <Typography id="modal-descripcion" sx={{ mb: 2 }}> Marca: {(marcaDetalle(item.Marca))}</Typography>
            <Typography id="modal-descripcion" sx={{ mb: 2 }}> <CategoryIcon/> {(categoriaDetalle(item.Categoria))}</Typography>
            <img src={`${BASE_URL}/${item.Imagen}`} alt={item.NombreProducto} style={{ width: '100%', borderRadius: 8,
               marginBottom: 16, maxHeight: '300px' }}/>
            <Typography id="modal-descripcion" sx={{ mb: 2 }}>{item.Descripcion}</Typography>
              {/*Calificaciones */}
              <Box display="flex" flexWrap="wrap">
                <Box widht="100%"> 
                  <Typography id="modal-descripcion" sx={{ mb: 2 }}>Calificación</Typography>
                  {[...Array(Math.round(Number(item.Calificacion)))].map((_, i) => (
                  <ThumbUpAltIcon key={'filled-' + i} sx={{ color: '#2196F3' }} />
                  ))}
                  {[...Array(Math.round(5 - Number(item.Calificacion)))].map((_, i) => (
                  <ThumbUpOffAltIcon key={'empty-' + i} sx={{ color: '#2196F3' }} />
                  ))}
                  </Box>
              </Box>
              <Box sx={{ my: 2 }} />
              <Box marginLeft='auto'>{item.IdPromocion == 0 ?
                    <Typography align='right'> <PointOfSaleIcon sx={{verticalAlign: 'middle'}}/> ₡{Number(item.Precio)
                      .toLocaleString('en-US')} </Typography>:
                    <><Typography align='right' sx={{ textDecoration: 'line-through' }}> <PointOfSaleIcon
                       sx={{verticalAlign: 'middle'}}/> ₡{Number(item.Precio).toLocaleString('en-US')} </Typography>
                    <Typography align='right' color = "red"><DiscountIcon sx={{verticalAlign: 'middle'}}/>
                      Promoción: ₡{Number(promocionDetalle(item.IdPromocion,item.Precio)).toLocaleString('en-US')}</Typography></>
                  }</Box>
              <Box sx={{ my: 2 }} />
            <Typography id="modal-descripcion" sx={{ mb: 2 }}><WarehouseIcon/>Disponibles: {item.Existencias}</Typography>
            <Button variant="contained" onClick={onClose}>Cerrar</Button>
          </Box>
          <Box display="flex" sx={{maxHeight: '80vh', overflowY:"auto", width:'50%'}} >
            <Grid display="block" sx={{width:'90%'}}>
                {opiniones1.length > 0 ? 
                  (opiniones1.map((item) => (
                    <Grid size={8} key={item.Id} minWidth='250px'>
                      {/*Tarjeta*/}
                        <Grid size={4} sm={4}>
                          <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
                            {(<Controller name='tarjeta' control={control} defaultValue=""
                              render={({field})=>( <ReviewCard field={field} data={item}/> )} /> )}
                          <FormHelperText sx={{color: '#d32f2f'}}></FormHelperText>
                        </FormControl>
                      </Grid>
                    </Grid>))
                ):(<>Este producto aún no cuenta con reseñas. Se el primero en reseñar este producto:<br />
                  <IconButton component={RouterLink} to={`/Paginas/crearReseña/${item.IdProducto}/${item.NombreProducto}`}>Nueva Reseña</IconButton></>)}
            </Grid>
            <Typography id="modal-titulo" variant="h6" component="h2" gutterBottom>{(opinionDetalle(item.IdProducto)).Opinion} </Typography>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}