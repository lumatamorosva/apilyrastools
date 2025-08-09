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
import { useTranslation } from 'react-i18next';

ListCardProductos.propTypes = {
  data: PropTypes.array,
  isShopping: PropTypes.bool.isRequired,
};

export function ListCardProductos({ data, isShopping }) {
  //Para la traducción
  const { t } = useTranslation();
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
    //Para marcar categorias en los checkboxes:
    const [catChecked, setCatChecked] = useState({});
    const handleChangeCat = (event,id) => {setCatChecked(prev => ({...prev,[id]: event.target.checked}));};
      //Busqueda con checkboxes
      const categoriasSeleccionadas = Object.keys(catChecked).filter((id) => catChecked[id]).map(Number);
    //Para marcar marcas en los checkboxes:
    const [marcaChecked, setMarcaChecked] = useState({});
    const handleChangeMarca = (event,id) => {setMarcaChecked(prev => ({...prev,[id]: event.target.checked}));};
      //Busqueda con checkboxes
      const marcasSeleccionadas = Object.keys(marcaChecked).filter((id) => marcaChecked[id]).map(Number);
      //Remover acentos
      const normalizar = (texto) =>texto?.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  //Aplicar filtros:
  const [busqueda, setBusqueda] = useState('');
  const filtrados = Array.isArray(data)
  ? data.filter((producto) => {
      const nombreCoincide = normalizar(producto.NombreProducto).includes(normalizar(busqueda));
      const categoriaCoincide =categoriasSeleccionadas.length === 0 || categoriasSeleccionadas.includes(Number(producto.Categoria));
      const marcaCoincide = marcasSeleccionadas.length === 0 || marcasSeleccionadas.includes(Number(producto.Marca));
      return nombreCoincide && categoriaCoincide && marcaCoincide;
    })
  //Para ordenar comparando respecto al precio de cada producto
  .sort((a,b)=>{
    if(orden==='ascendente'){return a.Precio - b.Precio;
    }else if(orden==='descendente'){return b.Precio - a.Precio;
    }
  }) : [];
  //Para activar el filtro de busqueda   
  const handleChangeBuscar = (e) => {
    setBusqueda(e.target.value);
  };
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
        <InputLabel sx={{color: 'white', '&.Mui-focused': { color: 'white'}}} id="ordenDropDown">{t('catalog.order')}</InputLabel>
          <Select sx={{ color: 'white' }} labelId="ordenDropDown" id="ordenDropDown" value={orden} label="ordenDropDown" onChange={handleChange}>
            <MenuItem value={'descendente'}>Mayor a menor</MenuItem>
            <MenuItem value={'ascendente'}>Menor a mayor</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ m: 1, minWidth: "20%"}} size="small" color='white'>
          <TextField InputLabelProps={{sx: {color: 'white','&.Mui-focused': {color: 'white','& input':
            {color: 'white'}}}}} sx={{'& .MuiInputBase-input': {color: 'white'}}}
            size="small" id="buscar" label={t('catalog.search')} onChange={handleChangeBuscar}></TextField>
        </FormControl>
      </Box>
      
    </Grid>
    <Grid sx={{display:'flex', mt:'10px'}}>
      <Box size={4} color='white' sx={{borderRadius:1, backgroundColor:(theme) => theme.palette.secondary.main, p:'15px'}}>
        <Box>
          {t('catalog.categories')}{cats.map((item) =>
          (
            <FormGroup key={item.IdCategoria} >
                <FormControlLabel control={<Checkbox checked={!!catChecked[item.IdCategoria]} size="small"
                onChange={(e)=>handleChangeCat(e,item.IdCategoria)}></Checkbox>}
                 label={<Typography variant="body2">{item.Nombre}</Typography>}></FormControlLabel>
            </FormGroup>
          ))}
        </Box>
        <Box>
          {t('catalog.brands')}
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
                  {item.IdPromocion > 0 && <Typography position="absolute" sx={{top:150, fontWeight:'bold',}} color = "red"> {t('catalog.promoon')} </Typography> }
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
    
    <Emergente lang={t} open={open} onClose={cerrarPopup} item={productoActivo} BASE_URL={BASE_URL} /></>
  );
}
