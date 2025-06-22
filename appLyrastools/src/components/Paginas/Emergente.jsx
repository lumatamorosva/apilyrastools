import React from 'react';
import { useEffect, useState } from "react";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import CategoryIcon from '@mui/icons-material/Category';

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

  export default function Emergente({ open, onClose, item, BASE_URL }) {
  if (!item) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-titulo"
      aria-describedby="modal-descripcion"
    >

      <Box sx={stylePopup}>
        
        <Typography id="modal-titulo" variant="h6" component="h2" gutterBottom>{item.NombreProducto} </Typography>
        <Typography id="modal-descripcion" sx={{ mb: 2 }}> Marca: {(marcaDetalle(item.Marca))}</Typography>
        <Typography id="modal-descripcion" sx={{ mb: 2 }}> <CategoryIcon/> {(categoriaDetalle(item.Categoria))}</Typography>
        <img
          src={`${BASE_URL}/${item.Imagen}`}
          alt={item.NombreProducto}
          style={{ width: '100%', borderRadius: 8, marginBottom: 16 }}
        />
        <Typography id="modal-descripcion" sx={{ mb: 2 }}>{item.Descripcion}</Typography>
        <Typography variant="body2" color="text.secondary">
           <LocalAtmIcon/> Precio: ₡{Number(item.Precio).toLocaleString('en-US')}
        </Typography>
        <Typography id="modal-descripcion" sx={{ mb: 2 }}><WarehouseIcon/>Disponibles: {item.Existencias}</Typography>
        <Button variant="contained" onClick={onClose}>Cerrar</Button>
      </Box>
    </Modal>
  );
}