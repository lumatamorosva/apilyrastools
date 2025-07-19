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

//Estilo de la ventana emergente
  const stylePopup = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
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

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-titulo" aria-describedby="modal-descripcion" >
      <Box sx={stylePopup}>
        <Box display= "flex" gap="10px">
          <Box>
            <Typography id="modal-titulo" variant="h6" component="h2" gutterBottom>{"Derecha"} </Typography>
          </Box>
          <Box>
            <Typography id="modal-titulo" variant="h6" component="h2" gutterBottom>{"Izquierda"} </Typography>
          </Box>
        </Box>
        <Typography id="modal-titulo" variant="h6" component="h2" gutterBottom>{item.NombreProducto} </Typography>
        <Typography id="modal-descripcion" sx={{ mb: 2 }}> Marca: {(marcaDetalle(item.Marca))}</Typography>
        <Typography id="modal-descripcion" sx={{ mb: 2 }}> <CategoryIcon/> {(categoriaDetalle(item.Categoria))}</Typography>
        <img
          src={`${BASE_URL}/${item.Imagen}`}
          alt={item.NombreProducto}
          style={{ width: '100%', borderRadius: 8, marginBottom: 16 }}
        />
        <Typography id="modal-descripcion" sx={{ mb: 2 }}>{item.Descripcion}</Typography>
        <Box display="flex">
                            <Box widht="100%"> 
                              {[...Array(Math.round(Number(item.Calificacion)))].map((_, i) => (
                                <ThumbUpAltIcon key={'filled-' + i} sx={{ color: '#2196F3' }} />
                              ))}
                              {[...Array(Math.round(5 - Number(item.Calificacion)))].map((_, i) => (
                                <ThumbUpOffAltIcon key={'empty-' + i} sx={{ color: '#2196F3' }} />
                              ))}
                            </Box>
                            <Box marginLeft='auto'>
                              {item.IdPromocion == 0 ?
                                <Typography align='right'> <PointOfSaleIcon sx={{verticalAlign: 'middle'}}/> ₡{Number(item.Precio).toLocaleString('en-US')} </Typography>:
                                <> <Typography align='right' sx={{ textDecoration: 'line-through' }}> <PointOfSaleIcon sx={{verticalAlign: 'middle'}}/> ₡{Number(item.Precio).toLocaleString('en-US')} </Typography>
                                <Typography align='right' color = "red"><DiscountIcon sx={{verticalAlign: 'middle'}}/>
                                Promoción: ₡{Number(promocionDetalle(item.IdPromocion,item.Precio)).toLocaleString('en-US')}</Typography></>
                              }
                            </Box>
                          </Box>
        
        <Typography id="modal-descripcion" sx={{ mb: 2 }}><WarehouseIcon/>Disponibles: {item.Existencias}</Typography>
        <Button variant="contained" onClick={onClose}>Cerrar</Button>
      </Box>
    </Modal>
  );
}