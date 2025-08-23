import React, { useEffect, useState } from 'react';
import {Grid, Paper, Typography } from '@mui/material';
import {ReviewCard} from './Form/ReviewCard';
import FormControl from '@mui/material/FormControl';
import { useForm, Controller} from 'react-hook-form';
import { FormHelperText } from '@mui/material';
import IconButton from "@mui/material/IconButton";
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PedidoService from "../../services/PedidoService";
import Box from '@mui/material/Box';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

 //Traer las opiniones:
 export function opinionDetalle() {
      const [opiniones, setOpiniones] = useState([]);
      useEffect(() =>{
      fetch(`http://localhost:81/apilyrastools/opiniones/getRecientes/`)
              .then((res) => res.json())
              .then(data => setOpiniones(data));
      },[]);
        return opiniones;
    }

export default function Dashboard() {
    //Para la traducción
    const { t } = useTranslation();
    const {control} = useForm({});
    //Trer productos vendidos
    const [vendidos, setVendidos]= useState({});
    const [vendidosHoy, setVendidosHoy]= useState({});
    const [totalHoy, setTotalHoy]= useState({});
    const [estados, setEstados]= useState({});
    const estadosMap = {'0': t('tableP.cancelada'),'1': t('tableP.abierta'),'2': t('tableP.pagada'),};
    const [top, setTop]= useState({});
    const [error, setError] = useState("");
    const [loaded, setLoaded] = useState(false);
    const opiniones1 = opinionDetalle();
    //Carga de todos los productos:
      const cargar = async () => {
        try{
          const response = await PedidoService.getVendidos();
          setVendidos(response.data);
          setLoaded(true);
          const response3 = await PedidoService.getEstados();
          const estadosConNombre = response3.data.map(item=>({...item,estado:estadosMap[item.estado]||item.estado}));
          setEstados(estadosConNombre);                 
          const response4 = await PedidoService.getTop3();
          setTop(response4.data);            
          const response1 = await PedidoService.getVendidosHoy();
          setVendidosHoy(response1.data); 
          const response2 = await PedidoService.getTotalHoy();
          setTotalHoy(response2.data);
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
    if (!loaded) return <p>{t('table.sin')}</p>;
    if (error) return <p>Error: {error.message}</p>;
    return (
        <>
            <Typography variant="h6" gutterBottom>{t('dashboard.title')}</Typography>
            <Grid item spacing={1}>
                <Grid item xs={12} md={6} >
                    <Paper elevation={3} style={{ padding: '1rem' }}>
                    <Typography variant="h6">{t('dashboard.vendidos')}</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={vendidos}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="NombreProducto" />
                                <YAxis />
                                <Tooltip formatter={(value, name) => [value, t('dashboard.cant')]}/>
                                <Bar dataKey="Cantidad" fill="#498B97" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
                <Grid container spacing={2} sx={{ mt: 1 }} >
                    {/* Columna izquierda */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} style={{ padding: '1rem' }}>
                            <Typography variant="h6">{t('dashboard.vendidoshoy')}</Typography>
                            {vendidosHoy && vendidosHoy.length > 0? (<ResponsiveContainer width="100%" height={300} spacing={2}>
                                <BarChart data={vendidosHoy}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="NombreProducto" />
                                    <YAxis />
                                    <Tooltip formatter={(value, name) => [value, t('dashboard.cant')]}/>
                                    <Bar dataKey="Cantidad" fill="#498B97" />
                                </BarChart>
                            </ResponsiveContainer>): (<>
                                <Typography variant="body1" align="center">{t('dashboard.sin')}</Typography></>)}
                        </Paper>
                    </Grid>
                    {/* Columna derecha */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} style={{ padding: '1rem' }}>
                            <Typography variant="h6">{t('dashboard.facts')}</Typography>
                            {totalHoy && totalHoy.lenght > 0 ? (<ResponsiveContainer width="100%" height={300}>
                                <BarChart data={totalHoy}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="idFactura" />
                                    <YAxis />
                                    <Tooltip formatter={(value, name) => [value, t('dashboard.cant')]}/>
                                    <Bar dataKey="TotalFactura" fill="#498B97" />
                                </BarChart>
                            </ResponsiveContainer>): (<>
                            <Typography variant="body1" align="center">{t('dashboard.sin')}</Typography></>)}
                        </Paper>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={6} sx={{ mt: 3 }}>
                    <Paper elevation={3} style={{ padding: '1rem' }}>
                    <Typography variant="h6">{t('dashboard.estado')}</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={estados}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="estado" />
                                <YAxis />
                                <Tooltip formatter={(value, name) => [value, t('dashboard.cant')]}/>
                                <Bar dataKey="cantidad" fill="#498B97" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
                <Grid container spacing={2} alignItems="stretch" sx={{ mt: 1 }} >

                    {/* Columna izquierda */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} style={{ padding: '1rem' }}>
                            <Typography variant="h6">{t('dashboard.top3')}</Typography>
                            {top && (<ResponsiveContainer width="100%" height={300} spacing={2}>
                                <BarChart data={top}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="NombreProducto" />
                                    <YAxis />
                                    <Tooltip formatter={(value, name) => [value, t('dashboard.cant')]}/>
                                    <Bar dataKey="CantidadVendida" fill="#498B97" />
                                </BarChart>
                            </ResponsiveContainer>)}
                        </Paper>
                    </Grid>
                    {/* Columna derecha */}
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} style={{ padding: '1rem' }}>
                            <Typography variant="h6">{t('dashboard.ultimas')}</Typography>
                            <Box display="flex" sx={{maxHeight: '300px', overflowY:"auto", width:'100%'}} >
                                <Grid display="block" sx={{width:'100%'}}>
                                    {opiniones1 && (opiniones1.map((item1) => (
                                            <Grid size={8} key={item1.Id} minWidth='250px'>
                                                {/*Tarjeta*/}
                                                    <FormControl fullWidth sx={{ m: 1 }}>
                                                        {(<Controller name='tarjeta' control={control} defaultValue=""
                                                        render={({field})=>(<ReviewCard field={field} data={item1}/>)
                                                        }/>)}
                                                    </FormControl>    
                                            </Grid>
                                        ))
                                    )}
                                </Grid>
                            </Box>    
                        </Paper>
                    </Grid> 
                </Grid>
            </Grid>
        </>
    )
}