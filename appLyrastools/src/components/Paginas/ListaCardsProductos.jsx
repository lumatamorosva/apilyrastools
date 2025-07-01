import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import PropTypes, { number } from 'prop-types';
import { useCart } from '../../hooks/useCart';
import TextField from '@mui/material/TextField';
//Para la ventana emergente
import CardActionArea from '@mui/material/CardActionArea';
import Emergente from './Emergente';

ListCardProductos.propTypes = {
  data: PropTypes.array,
  isShopping: PropTypes.bool.isRequired,
};

export function ListCardProductos({ data, isShopping }) {
  const { addItem } =useCart()
  //Url para acceder a la imagenes guardadas en el API
  const BASE_URL = import.meta.env.VITE_BASE_URL + 'uploads';
  const [open, setOpen] = useState(false);
  const [productoActivo, setProductoActivo] = useState(null);

  //Funcion para Emergente
  async function abrirPopup(item) {
    setProductoActivo(item);
    setOpen(true);
  }
  const cerrarPopup = () => {
    setOpen(false);
    setProductoActivo(null);
  };

  //Función para agregar al carrito
    //Guarda la cantidad de elementos en el textfield
    const [cantidad, setCantidad] = useState({});
    //Función de agregar
    async function  agregarElemento(item, cantidad) {
      if(cantidad>0 && number){
        alert('Agregado: '+cantidad);
      }else{
        alert('Debe agregar al menos un '+item.NombreProducto);
      }
    }
  
  //Para el dropDownOrden
  const [orden, setOrden] = useState('');
  const handleChange = (event) => {
    setOrden(event.target.value); // Actualiza el estado con el valor seleccionado
  };
  //Para el dropDownCantidad
  const [modo, setModo] = useState('');
  const handleChange1 = (event) => {
    setModo(event.target.value); // Actualiza el estado con el valor seleccionado
  };
  //Para la busqueda de productos
  const [busqueda, setBusqueda] = useState('');
  const filtrados = data.filter(producto => producto.NombreProducto.toLowerCase().includes(busqueda.toLowerCase()))
  //Para ordenar comparando respecto al precio de cada producto
  .sort((a,b)=>{
    if(orden==='ascendente'){
      return a.Precio - b.Precio;
    }else if(orden==='descendente'){
      return b.Precio - a.Precio;
    }
  });
  //Para la paginación
    //Define la cantidad de páginas que se ocupan
    const totalPaginas = ( modo ? (Math.ceil(filtrados.length/modo)) : 1);
  //Para activar el filtro de busqueda   
  const handleChangeBuscar = (e) => {
    setBusqueda(e.target.value);
    // Aquí puedes disparar un filtro o búsqueda
    console.log("Buscando:", e.target.value);
  };

  return (
    <>
    <Grid row size={12}>
      <Box sx={{display:'flex', borderRadius:1, backgroundColor:(theme) => theme.palette.secondary.main}}>
        {/* Orden Dropdown */}
       <FormControl sx={{ m: 1, minWidth: "20%" }} size="small">
        <InputLabel id="ordenDropDown">Orden</InputLabel>
          <Select labelId="ordenDropDown" id="ordenDropDown" value={orden} label="ordenDropDown" onChange={handleChange}>
            <MenuItem value={'descendente'}>Mayor a menor</MenuItem>
            <MenuItem value={'ascendente'}>Menor a mayor</MenuItem>
          </Select>
        </FormControl>
        {/* Modo Dropdown */}
       <FormControl sx={{ m: 1, minWidth: "20%" }} size="small">
        <InputLabel id="modoDropDown">Artículos</InputLabel>
          <Select labelId="modoDropDown" id="modoDropDown" value={modo} label="modoDropDown" onChange={handleChange1}>
            <MenuItem value={'10'}>10</MenuItem>
            <MenuItem value={'30'}>30</MenuItem>
            <MenuItem value={'40'}>40</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: "20%" }} size="small">
          <TextField size="small" id="buscar" label="Buscar..." onChange={handleChangeBuscar}></TextField>
        </FormControl>
          <Box sx={{alignContent:'center', mr:'1px', ml:'auto'}}>
            <Stack spacing={2}>
              <Pagination count={totalPaginas} shape="rounded" />
            </Stack>
        </Box>
      </Box>
      
    </Grid>
    <Grid sx={{display:'flex', mt:'10px'}}>
      <Box size={4} sx={{borderRadius:1, backgroundColor:(theme) => theme.palette.secondary.main, p:'15px'}}>Aquí van los filtros</Box>
        <Grid size={8} container sx={{ p: 2 }} spacing={3}>
        {/* ()=>{} */}
        {filtrados && filtrados.map((item) => (
            <Grid size={4} key={item.id} minWidth='180px'>
              <Card>
                <CardActionArea onClick={() => item && abrirPopup(item)}> 
                <CardMedia height="180px" component="img" image={`${BASE_URL}/${item?.Imagen}`} alt={item.Imagen} sx={{width: '100%', objectFit: 'contain'}}/>
                <Box sx={{display:'flex',justifyContent: 'center', }}>
                  {item.IdPromocion > 0 && <Typography position="absolute" sx={{top:150, fontWeight:'bold',}} color = "red"> Artículo en promoción </Typography> }
                </Box>
                <CardContent>
                  <Typography variant="body3" color="text.primary" align="center"> {item.NombreProducto}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <LocalAtmIcon sx={{ verticalAlign: 'middle' }}/>  ₡{Number(item.Precio).toLocaleString('en-US')}
                  </Typography>
                  {isShopping && ( <Typography variant="h6" align="right" gutterBottom> &cent;{item.Precio} </Typography>)}
                </CardContent>
                </CardActionArea>
                <CardActions
                  disableSpacing
                  sx={{
                    backgroundColor: (theme) => theme.palette.action.focus,
                    color: (theme) => theme.palette.common.white,
                  }}
                >
                  <IconButton onClick={() => item && agregarElemento(item,cantidad[item.IdProducto])}
                    sx={{ mr: '10%', ml: 'auto' ,border:'0.5px solid', borderRadius:1,width:'40%'}}
                  ><ShoppingCartIcon />
                  </IconButton>
                  <TextField size='small' value={cantidad[item.IdProducto]}
                   onChange={(e) => setCantidad((prev) => ({...prev,[item.IdProducto]: parseInt(e.target.value)}))}
                   type="number" style={{width:'50%',maxWidth:'50%', ml: '10%', mr: 'auto'}} inputProps={{min: 0}}></TextField>
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Grid>
    
    <Emergente open={open} onClose={cerrarPopup} item={productoActivo} BASE_URL={BASE_URL} /></>
  );
}
