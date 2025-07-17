import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import PropTypes, { number } from 'prop-types';
import { useCart } from '../../hooks/useCart';
import TextField from '@mui/material/TextField';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import toast from 'react-hot-toast';
//Para la ventana emergente
import CardActionArea from '@mui/material/CardActionArea';
import Emergente from './Emergente';

ListCardProductos.propTypes = {
  data: PropTypes.array,
  isShopping: PropTypes.bool.isRequired,
};

export function ListCardProductos({ data, isShopping }) {
  console.log("Productos traídos: ", data);
  //const { addItem } =useCart()
  //Url para acceder a la imagenes guardadas en el API
  const BASE_URL = import.meta.env.VITE_BASE_URL + 'uploads';
  const [open, setOpen] = useState(false);
  const [productoActivo, setProductoActivo] = useState(null);

  //Funcion para Mostrar Emergente
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
    //Función de agregar con verificación de existencias
    const {addItem} = useCart();
    async function  agregarElemento(item, cantidad) {
      if(cantidad>item.Existencias){
      toast.error("De este producto solo quedan " + item.Existencias + " unidades en Stock");
      }else{
         addItem(item,cantidad);
      }
    }
  //Para el dropDownOrden
  const [orden, setOrden] = useState('');
  const handleChange = (event) => {
    setOrden(event.target.value); // Actualiza el estado con el valor seleccionado
  };
  //Para la busqueda de productos
  const [busqueda, setBusqueda] = useState('');
  const filtrados =  Array.isArray(data) ? data.filter(producto => producto.NombreProducto.toLowerCase().includes(busqueda.toLowerCase())): []
  //Para ordenar comparando respecto al precio de cada producto
  .sort((a,b)=>{
    if(orden==='ascendente'){return a.Precio - b.Precio;
    }else if(orden==='descendente'){return b.Precio - a.Precio;
    }
  });
  //Para activar el filtro de busqueda   
  const handleChangeBuscar = (e) => {
    setBusqueda(e.target.value);
  };
  //Para marcar categorias:
    const [catChecked, setCatChecked] = useState(false);
    const handleChangeCat = (event,id) => {setCatChecked(prev => ({...prev,[id]: event.target.checked}));};
    //Para marcar marcas:
    const [marcaChecked, setMarcaChecked] = useState(false);
    const handleChangeMarca = (event,id) => {setMarcaChecked(prev => ({...prev,[id]: event.target.checked}));};
  //Traer las categorias:
    const [cats, setCats] = useState([]);
    useEffect(() =>{
    fetch(`http://localhost:81/apilyrastools/categoria`)
            .then((res) => res.json())
            .then(data => setCats(data));
    },[]);
    //Traer las marcas:
    const [marcas, setMarcas] = useState([]);
    useEffect(() =>{
    fetch(`http://localhost:81/apilyrastools/marca`)
            .then((res) => res.json())
            .then(data => setMarcas(data));
    },[]);

  return (
    <>
    <Grid row size={12}>
      <Box sx={{display:'flex', borderRadius:1, backgroundColor:(theme) => theme.palette.secondary.main}}>
        {/* Orden Dropdown */}
       <FormControl sx={{ m: 1, minWidth: "20%"}} size="small">
        <InputLabel sx={{color: 'white', '&.Mui-focused': { color: 'white'}}} id="ordenDropDown">Orden</InputLabel>
          <Select sx={{ color: 'white' }} labelId="ordenDropDown" id="ordenDropDown" value={orden} label="ordenDropDown" onChange={handleChange}>
            <MenuItem value={'descendente'}>Mayor a menor</MenuItem>
            <MenuItem value={'ascendente'}>Menor a mayor</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: "20%"}} size="small" color='white'>
          <TextField InputLabelProps={{sx: {color: 'white','&.Mui-focused': {color: 'white','& input':
            {color: 'white'}}}}} sx={{'& .MuiInputBase-input': {color: 'white'}}}
            size="small" id="buscar" label="Buscar..." onChange={handleChangeBuscar}></TextField>
        </FormControl>
      </Box>
      
    </Grid>
    <Grid sx={{display:'flex', mt:'10px'}}>
      <Box size={4} color='white' sx={{borderRadius:1, backgroundColor:(theme) => theme.palette.secondary.main, p:'15px'}}>
        <Box>
          Categorías:
          {cats.map((item) =>
          (
            <FormGroup key={item.IdCategoria} >
                <FormControlLabel control={<Checkbox checked={!!catChecked[item.IdCategoria]} size="small"
                onChange={(e)=>handleChangeCat(e,item.IdCategoria)}></Checkbox>}
                 label={<Typography variant="body2">{item.Nombre}</Typography>}></FormControlLabel>
            </FormGroup>
          ))}
        </Box>
        <Box>
          Marcas:
          {marcas.map((item) =>
          (
            <FormGroup key={item.IdMarca} >
                <FormControlLabel control={<Checkbox checked={!!marcaChecked[item.IdMarca]} size="small"
                onChange={(e)=>handleChangeMarca(e,item.IdMarca)}></Checkbox>}
                 label={<Typography variant="body2">{item.Nombre}</Typography>}></FormControlLabel>
            </FormGroup>
          ))}
        </Box>

      </Box>
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
                  <Typography variant="body1" color="text.primary" align="center"> {item.NombreProducto}</Typography>
                  <Box display="flex">
                    <Box>
                      {[...Array(Math.round(Number(item.Calificacion)))].map((_, i) => (
                        <ThumbUpAltIcon key={'filled-' + i} sx={{ color: '#2196F3' }} />
                      ))}
                      {[...Array(Math.round(5 - Number(item.Calificacion)))].map((_, i) => (
                        <ThumbUpOffAltIcon key={'empty-' + i} sx={{ color: '#2196F3' }} />
                      ))}
                    </Box>
                    <Box marginLeft='auto'>
                      <Typography variant="body2" color="text.primary">
                        <PointOfSaleIcon sx={{ verticalAlign: 'middle' }}/>₡{Number(item.Precio).toLocaleString('en-US')}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                </CardActionArea>
                <CardActions
                  disableSpacing
                  sx={{
                    backgroundColor: (theme) => theme.palette.action.focus,
                    color: (theme) => theme.palette.common.white,
                  }}
                >
                  <IconButton onClick={() => item && agregarElemento(item,cantidad[item.IdProducto] ?? 1)}
                    sx={{ mr: '10%', ml: 'auto' ,border:'0.5px solid', borderRadius:1,width:'40%'}}
                  ><ShoppingCartIcon />
                  </IconButton>
                  <TextField size='small' value={cantidad[item.IdProducto] ?? 1}
                   onChange={(e) => setCantidad((prev) => ({...prev,[item.IdProducto]: parseInt(e.target.value)}))}
                   type="number" style={{width:'50%',maxWidth:'50%', ml: '10%', mr: 'auto'}} inputProps={{min: 1, max:item.Existencias}}></TextField>
                </CardActions>
              </Card>
            </Grid>
        ))}
      </Grid>
    </Grid>
    
    <Emergente open={open} onClose={cerrarPopup} item={productoActivo} BASE_URL={BASE_URL} /></>
  );
}
