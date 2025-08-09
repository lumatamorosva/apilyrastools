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
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

//Componente tabla
export default function ListPromociones() {
    //Para la traducción
    const { t } = useTranslation();
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
    toast.success(t('promos.toastEliminar'),{duration: 4000,position:'top-center'});
    cargarPromociones();
  } catch (error) {
    console.error("Error eliminando promoción:", error);
    toast.error(`Problema al eliminar. Contacte al administrador`,{duration: 4000,position:'top-center'});
  }
};
  if (!loaded) return <p>{t('promos.cargando')}</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <>
    <Typography variant="h5" gutterBottom>{t('promos.title')}
      <Tooltip title={t('promos.nueva')}><IconButton component={RouterLink} to="/Paginas/crearPromocion/" color="success"> <AddIcon/></IconButton></Tooltip>
    </Typography>
      <Box>
        <Typography fontSize="small">{t('promos.estado')}</Typography>
        <Grid container size="6">
            <Typography fontSize="small" backgroundColor="#db4848" marginLeft="10px" padding="5px">{t('promos.vencidas')}</Typography>
            <Typography fontSize="small" backgroundColor="#276dc2" marginLeft="10px" padding="5px">{t('promos.pendientes')}</Typography>
            <Typography fontSize="small" backgroundColor="#b1e6aa" marginLeft="10px" padding="5px">{t('promos.activas')}</Typography>
        </Grid>
      </Box>
      {data && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">
                  <Typography variant="subtitle1" color="primary" gutterBottom>{t('promos.nombre')}</Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="subtitle1" color="primary" gutterBottom>{t('promos.descripcion')}</Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="subtitle1" color="primary" gutterBottom>{t('promos.inicio')}</Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="subtitle1" color="primary" gutterBottom>{t('promos.fin')}</Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="subtitle1" color="primary" gutterBottom>{t('promos.porciento')}</Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="subtitle1" color="primary" gutterBottom>{t('promos.aplicaa')}</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="subtitle1" color="primary" gutterBottom>{t('promos.acciones')}</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.filter((row) => row != null).map((row) => (
                <TableRow key={row.IdPromocion} sx={{ "&:last-child td, &:last-child th": { border: 0 }, 
                backgroundColor:new Date() > new Date(row.FechaFinal) ? '#db4848': new Date() < new Date(row.FechaInicio) ? '#276dc2':'#b1e6aa'}} >
                  {/* Contenido de la tabla */}
                  <TableCell sx={{fontWeight:'bold'}} align="left">{row.Nombre}</TableCell>
                  <TableCell sx={{fontWeight:'bold'}} align="left">{row.Descripcion}</TableCell>
                  <TableCell sx={{fontWeight:'bold'}} align="left">{row.FechaInicio ? formatDate(parseDate(row.FechaInicio)) : "Fecha no válida"}</TableCell>
                  <TableCell sx={{fontWeight:'bold'}} align="left">{row.FechaFinal ? formatDate(parseDate(row.FechaFinal)) : "Fecha no válida"}</TableCell>
                  <TableCell sx={{fontWeight:'bold'}} align="center">{row.Cantidad}%</TableCell>
                  <TableCell sx={{fontWeight:'bold'}} align="left">{row.AplicaA}</TableCell>
                  <TableCell sx={{fontWeight:'bold'}} align="right">
                    <Box display="flex" justifyContent="flex-end">
                      <Tooltip title={t('promos.actualizar')}>
                        {/* función anónima */}
                        <IconButton onClick={() => update(row.IdPromocion)} color="success">
                          <EditIcon key={row.id} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('promos.eliminar')}>
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
