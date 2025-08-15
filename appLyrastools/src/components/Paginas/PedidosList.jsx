/* eslint-disable no-unused-vars */
//https://mui.com/material-ui/react-table/#sorting-amp-selecting
import React from 'react';
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import Tooltip from "@mui/material/Tooltip";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import PedidoService from "../../services/PedidoService";

export default function PedidosList() {
    //Para la traducción
        const { t } = useTranslation();
    //Obtener usuario
        const {user, decodeToken,autorize}= useContext(UserContext);
        const [userData,setUserData]=useState(decodeToken()); 
        useEffect(()=>{setUserData(decodeToken())},[user]);
      //Datos a cargar en la tabla
        const [data, setData] = useState({});
        const [error, setError] = useState("");
        const [loaded, setLoaded] = useState(false);
    //Enlaces o redireccionar
         const navigate = useNavigate();
    //Carga de todos los productos:
      const cargar = async () => {
        try{
          const response = await PedidoService.getPedidosUsuario(userData.id);
          setData(response.data);
          setLoaded(true);   
        }catch{
            if (error instanceof SyntaxError) {
                setError(error);
                console.log(error);
                setLoaded(false);
                throw new Error("Respuesta no válida del servidor");
            }
        }};
    //Obtener lista del API
      useEffect(() => {cargar();}, []);
    if (!loaded) return <p>{t('table.carga')}</p>;
    if (error) return <p>Error: {error.message}</p>;
    //Para la función ver detalles
    const seeDetails = (id) => {return navigate(`/Paginas/Pedido/${id}`);};
    //Para la descripción del estado
    const estadoSelect = (id) =>  id==1?t('tableP.abierta'):id==2?t('tableP.pagada'):t('tableP.cancelada');

    return (
        <><Typography variant="h5" gutterBottom>{t('tableP.title')}</Typography>
            {data && (
                <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left"><Typography variant="subtitle1" gutterBottom>{t('tableP.id')}</Typography></TableCell>
                            <TableCell align="left"><Typography variant="subtitle1" gutterBottom>{t('tableP.fechaI')}</Typography></TableCell>
                            <TableCell align="left"><Typography variant="subtitle1" gutterBottom>{t('tableP.fechaC')}</Typography></TableCell>
                            <TableCell align="left"><Typography variant="subtitle1" gutterBottom>{t('tableP.estado')}</Typography></TableCell>
                            <TableCell align="left"><Typography variant="subtitle1" gutterBottom>{t('tableP.total')}</Typography></TableCell>
                            <TableCell align="right"><Typography variant="subtitle1" gutterBottom>{t('tableP.select')}</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {data.map((row) => (<TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }} >
                        {/* Contenido de la tabla */}
                        <TableCell align="left">{row.idFactura}</TableCell>
                        <TableCell align="left">{row.fechaCreacion}</TableCell>
                        <TableCell align="left">{row.fechaPago}</TableCell>
                        <TableCell align="left">{estadoSelect(row.estado)}</TableCell>
                        <TableCell align="right">{row.total}</TableCell>
                        <TableCell align="right"><Tooltip title={t('tableP.select')}>
                            {/* función anónima */}
                                <IconButton onClick={() => seeDetails(row.IdProducto)} color="success"><FormatListNumberedIcon key={row.id} /></IconButton>
                            </Tooltip>
                        </TableCell>
                        {/* Contenido de la tabla */}
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>
            )}
        </>
    )
}