import React, { useState } from 'react';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell,{ tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { useEffect } from "react";
import ProductoService from "../../services/ProductoService";
import { useNavigate} from "react-router-dom";
import { useTranslation } from 'react-i18next';
import PedidoService from "../../services/PedidoService";
import { useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import TableFooter from '@mui/material/TableFooter';
import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';

//Estilo de Tabla
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.footer}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontSize: 16,
  },
}));

export default function Pedido() {
    //Para la traducción
    const { t } = useTranslation();
    const {idPedido} = useParams(); 
     //Datos a cargar en la tabla
        const [data, setData] = useState([]);
        const [error, setError] = useState("");
        const [loaded, setLoaded] = useState(false);
    //Enlaces o redireccionar
         const navigate = useNavigate();

          
        //Carga de todos los detalles:
          const cargar = async () => {
            try{
              const response = await PedidoService.getDetalles(idPedido);
              setData(response.data);
              setLoaded(true);
            }catch(error){
                if (error instanceof SyntaxError) {
                    setError(error);
                    console.log(error);
                    setLoaded(false);
                    throw new Error("Respuesta no válida del servidor");
                }
            }};
        //Obtener lista del API
        useEffect(() => {cargar();}, []);

        //Para la factura
  const [factura, setFactura] = useState(null);
  useEffect(() => {
    const cargarFactura = async () => {
      try {
        if(idPedido){
            const res = await fetch(`http://localhost:81/apilyrastools/pedido/getPedido/${idPedido}`);
            const result = await res.json();
            setFactura(result[0]);
        }
      } catch (e) {
        console.error("Error al cargar factura!", e);
      }
    };
    cargarFactura();
  }, [idPedido]);

  //Para el nombre del producto
function NombreProductoCell({ id }) {
  const [nombreProd, setNombreProd] = useState("");
  useEffect(() => {
    const cargarNombre = async () => {
      try {
        const res = await fetch(`http://localhost:81/apilyrastools/producto/${id}`);
        const data = await res.json();
        setNombreProd(data.NombreProducto || "Nombre no encontrado");
      } catch (e) {
        console.error("Error al cargar nombre:", e);
        setNombreProd("Error");
      }
    };
    cargarNombre();
  }, [id]);
  return <>{nombreProd || t('table.carga')}</>;
}

        //Para el nombre del cliente
        const [clienteN, setClienteN] = useState(null);
        useEffect(() => {
            const cargarClient = async () => {
            try {
                if(factura?.idCliente){
                    const res = await fetch(`http://localhost:81/apilyrastools/user/${factura?.idCliente}`);
                    const result = await res.json();  
                    setClienteN(result.Nombre + " " + result.Apellido);
                }
            } catch (e) {
                console.error("Error al cargar nombre del Cliente!", e);
            }
            };
            cargarClient();
        }, [factura]);

        //Para la dirección
        const [direccion, setDireccion] = useState(null);
        useEffect(() => {
            const cargarDireccion = async () => {
            try {
                if(factura?.idEntrega){
                    const res = await fetch(`http://localhost:81/apilyrastools/pedido/getDireccion/${factura?.idEntrega}`);
                    const result = await res.json();  
                    console.log("Direcciones:" , result);
                    setDireccion(result[0].Provincia + ", " + result[0].Canton+ ", " + result[0].Distrito + ". [" + result[0].Sennas + "].");
                }
            } catch (e) {
                console.error("Error al cargar nombre del Cliente!", e);
            }
            };
            cargarDireccion();
        }, [factura]);

          //Para el impuesto
        function ImpuestoCell({ id }) {
        const [imp, setImp] = useState(null);
        useEffect(() => {
            const cargarImp = async () => {
            try {
                if(id){
                    const res = await fetch(`http://localhost:81/apilyrastools/impuesto/${id}`);
                    const result = await res.json();  
                    setImp(result.Nombre + " (" + result.Porcentaje + "%)");
                }
            } catch (e) {
                console.error("Error al cargar Impuesto:", e);
            }
            };
            cargarImp();
        }, [id]);
        return <>{imp|| t('table.carga')}</>;
    }

    //Para la función regresar
    const regresar = () => {return navigate('/Paginas/PedidosList');};

    //Calculo del total
    const calcularSubtotalTotal = () => {
    return data.reduce((acc, row) => {
        const cantidad = parseFloat(row.Cantidad) || 0;
        const precio = parseFloat(row.PrecioIndividual) || 1;
        const impuesto = 13;
        return acc + ((cantidad * precio) + ((cantidad * precio) * (impuesto/100)));
    }, 0);
    };
    
    //Estilo de la fecha
const formatDate = (fecha) => {
  if (!fecha) return '';
  const date = new Date(fecha);
  const day = String(date.getDate()).padStart(2, '0');       
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

//Para la descripción del estado
    const estadoSelect = (id) =>  id==1?t('tableP.abierta'):id==2?t('tableP.pagada'):t('tableP.cancelada');

    return (
        <><Typography variant="h5" gutterBottom>{t('tableP.title2')}</Typography>
            {data && (
                <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead><Typography variant="subtitle1" gutterBottom>{t('tableP.id')}: {idPedido}</Typography>
                       <Typography variant="subtitle1" gutterBottom>{t('tableP.cliente')}: {clienteN}</Typography>
                        <Typography variant="subtitle1" gutterBottom>{t('tableP.fechaI')}: {formatDate(factura?.fechaCreacion)}</Typography>
                        <Typography variant="subtitle1" gutterBottom>{t('tableP.direccion')} {direccion}</Typography>
                        <TableRow>
                            <TableCell align="left"><Typography variant="subtitle1" gutterBottom>{t('tableP.idD')}</Typography></TableCell>
                            <TableCell align="left"><Typography variant="subtitle1" gutterBottom>{t('tableP.prod')}</Typography></TableCell>
                            <TableCell align="left"><Typography variant="subtitle1" gutterBottom>{t('tableP.cant')}</Typography></TableCell>
                            <TableCell align="right"><Typography variant="subtitle1" gutterBottom>{t('tableP.individual')}</Typography></TableCell>
                            <TableCell align="right"><Typography variant="subtitle1" gutterBottom>{t('tableP.col')}</Typography></TableCell>
                            <TableCell align="right"><Typography variant="subtitle1" gutterBottom>{t('tableP.dol')}</Typography></TableCell>
                            <TableCell align="right"><Typography variant="subtitle1" gutterBottom>{t('tableP.imp')}</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {data.map((row) => (<TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }} >
                            {/* Contenido de la tabla */}
                            <TableCell align="left">{row.Linea}</TableCell>
                            <TableCell align="left"><NombreProductoCell id={row.IdProducto}/></TableCell>
                            <TableCell align="left">{row.Cantidad}</TableCell>
                            <TableCell align="right">₡{Number(row.PrecioIndividual).toLocaleString('en-US')}</TableCell>
                            <TableCell align="right">₡{Number(row.PrecioColones).toLocaleString('en-US')}</TableCell>
                            <TableCell align="right">${Number(row.PrecioDolares).toLocaleString('en-US')}</TableCell>
                            <TableCell align="right"><ImpuestoCell id={row.IdImpuesto}/></TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <StyledTableCell colSpan={4} align="left"><Typography variant="subtitle1" gutterBottom>
                                {t('tableP.estadoDetalle') + estadoSelect(factura?.estado)}</Typography></StyledTableCell>
                            <StyledTableCell colSpan={8} align="right"><Typography variant="subtitle1" gutterBottom>
                                Total: ₡ {calcularSubtotalTotal().toLocaleString('en-US')}</Typography></StyledTableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
                </TableContainer>
            )}
            <Grid size={12} sm={12}>
                <Button onClick={() => regresar()} type="submit" variant="contained" color="secondary" sx={{ m: 1 }}>{t('tableP.boton')}</Button>
                {factura?.estado == 1 && (<Button onClick={() => pagar()} type="submit" variant="contained" color="secondary" sx={{ m: 1 }}>{t('tableP.boton2')}</Button>)}
                <Button onClick={() => window.print()} type="submit" variant="contained" color="secondary" sx={{ m: 1 }}>{t('tableP.boton3')}</Button>
            </Grid>
        </>
    )
}