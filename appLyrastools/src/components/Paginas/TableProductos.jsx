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
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useEffect } from "react";
import ProductoService from "../../services/ProductoService";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate, Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";

//Componente tabla
export default function TableProducts() {
  //Datos a cargar en la tabla
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  //Para los nombres de los datos de otras tablas
  const [nombreMarca, setMarca] = useState(false);
  const [nombreCategoria, setCat] = useState(false);
   //Enlaces o redireccionar
  const navigate = useNavigate();


  //Obtener lista del API
  useEffect(() => {
    ProductoService.getProductos()
      .then((response) => {
        console.log(response);
        setData(response.data);
        setError(response.error);
        setLoaded(true);

        //Traer el nombre de la Marca
        const brandIds = response.data.map((product) => product.Marca);
        const fetchBrands = brandIds.map((id) =>
          fetch(`http://localhost:81/apilyrastools/marca/${id}`)
            .then((res) => res.json())
            .then((data) => ({ [id]: data.Nombre }))
        );
        Promise.all(fetchBrands)
          .then((brandData) => {
            const brandObj = brandData.reduce((acc, curr) => ({ ...acc, ...curr }), {});
            setMarca(brandObj);
          })
          .catch((err) => {
            console.error("Error al traer los datos de la marca:", err);
            setError(err);
          });

          //Traer el nombre de la Categoría
        const catIds = response.data.map((product) => product.Categoria);
        const fetchCats = catIds.map((id) =>
          fetch(`http://localhost:81/apilyrastools/categoria/${id}`)
            .then((res) => res.json())
            .then((data) => ({ [id]: data.Nombre }))
        );
        Promise.all(fetchCats)
          .then((catData) => {
            const catObj = catData.reduce((acc, curr) => ({ ...acc, ...curr }), {});
            setCat(catObj);
          })
          .catch((err) => {
            console.error("Error al traer los datos de la categoría:", err);
            setError(err);
          });
      })
      .catch((error) => {
        if (error instanceof SyntaxError) {
          setError(error);
          console.log(error);
          setLoaded(false);
          throw new Error("Respuesta no válida del servidor");
        }
      });
  }, []);
  const update = (id) => {
    return navigate(`/producto/update/${id}`);
  };

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <>
    <Typography variant="h5" gutterBottom>Listado de Herramientas
      <Tooltip title="Crear"><IconButton component={Link} to="/Paginas/crear/" color="success"> <AddIcon/></IconButton> </Tooltip>
    </Typography>
      
      {data && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">
                  <Typography variant="subtitle1" color="primary" gutterBottom>Nombre</Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="subtitle1" color="primary" gutterBottom>Marca</Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography variant="subtitle1" color="primary" gutterBottom>Categoría</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="subtitle1" color="primary" gutterBottom> Acciones</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }} >
                  {/* Contenido de la tabla */}
                  <TableCell align="left">{row.NombreProducto}</TableCell>
                  <TableCell align="left">{nombreMarca[row.Marca]}</TableCell>
                  <TableCell align="left">{nombreCategoria[row.Categoria]}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Actualizar">
                      {/* función anónima */}
                      <IconButton onClick={() => update(row.id)} color="success">
                        <EditIcon key={row.id} />
                      </IconButton>
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
  );
}
