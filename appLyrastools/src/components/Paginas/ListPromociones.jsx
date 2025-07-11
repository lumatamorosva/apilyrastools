/* eslint-disable no-unused-vars */
//https://mui.com/material-ui/react-table/#sorting-amp-selecting
import React, { useState } from 'react';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useEffect } from "react";
import PromocionService from "../../services/PromocionesService";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate, Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

//Componente tabla
export default function ListPromociones() {
  //Formato de la fecha
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const parseDate = (str) => {
  const [year, month, day] = str.split('-'); // '2025-07-10'
  return new Date(Number(year), Number(month) - 1, Number(day));
};
  //Datos a cargar en la tabla
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
   //Enlaces o redireccionar
  const navigate = useNavigate();
  //Obtener lista del API
  useEffect(() => {
    cargarPromociones();
  }, []);

  //Carga de todas las promociones:
  const cargarPromociones = async () => {
  try {
    const response = await PromocionService.getAll();
    setData(response.data);
    setError(response.error);
    setLoaded(true);
  } catch (error) {
    if (error instanceof SyntaxError) {
          setError(error);
          console.log(error);
          setLoaded(false);
          throw new Error("Respuesta no válida del servidor");
        }
  }
};

  const update = (id) => {return navigate(`/Paginas/updatePromocion/${id}`);};

  //Para la función de eliminar:
  const handleDelete = async (id) => {
  try {
    await PromocionService.deletePromocion(id);
    cargarPromociones();
    // Aquí podrías actualizar la lista o mostrar un mensaje
  } catch (error) {
    console.error("Error eliminando promoción:", error);
  }
};
  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <>
    <Typography variant="h5" gutterBottom>Promociones en el sistema
      <Tooltip title="Nueva Promoción"><IconButton component={RouterLink} to="/Paginas/crearPromocion/" color="success"> <AddIcon/></IconButton></Tooltip>
    </Typography>
      <Box>
        <Typography fontSize="small">Estados de las promociones:</Typography>
        <Grid container size="6">
            <Typography fontSize="small" backgroundColor="#db4848" marginLeft="10px" padding="5px">Vencidas</Typography>
            <Typography fontSize="small" backgroundColor="#276dc2" marginLeft="10px" padding="5px">Pendientes</Typography>
            <Typography fontSize="small" backgroundColor="#b1e6aa" marginLeft="10px" padding="5px">Actualmente activas</Typography>
        </Grid>
      </Box>
      {data && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">
                  <Typography variant="subtitle1" color="primary" gutterBottom>Nombre</Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="subtitle1" color="primary" gutterBottom>Descripción</Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="subtitle1" color="primary" gutterBottom>Fecha inicial</Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="subtitle1" color="primary" gutterBottom>Fecha de vencimiento</Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="subtitle1" color="primary" gutterBottom>%</Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="subtitle1" color="primary" gutterBottom>Aplica a</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="subtitle1" color="primary" gutterBottom> Acciones</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.IdPromocion} sx={{ "&:last-child td, &:last-child th": { border: 0 }, 
                backgroundColor:new Date() > new Date(row.FechaFinal) ? '#db4848': new Date() < new Date(row.FechaInicio) ? '#276dc2':'#b1e6aa'}} >
                  {/* Contenido de la tabla */}
                  <TableCell align="left">{row.Nombre}</TableCell>
                  <TableCell align="left">{row.Descripcion}</TableCell>
                  <TableCell align="left">{row.FechaInicio ? formatDate(parseDate(row.FechaInicio)) : "Fecha no válida"}</TableCell>
                  <TableCell align="left">{row.FechaFinal ? formatDate(parseDate(row.FechaFinal)) : "Fecha no válida"}</TableCell>
                  <TableCell align="center">{row.Cantidad}%</TableCell>
                  <TableCell align="left">{row.AplicaA}</TableCell>
                  <TableCell align="right">
                    <Box display="flex" justifyContent="flex-end">
                      <Tooltip title="Actualizar">
                        {/* función anónima */}
                        <IconButton onClick={() => update(row.IdPromocion)} color="success">
                          <EditIcon key={row.id} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={'Eliminar'}>
                        <IconButton color="warning" onClick={()=> handleDelete(row.IdPromocion)}><DeleteIcon /></IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  {/* Contenido de la tabla */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}
