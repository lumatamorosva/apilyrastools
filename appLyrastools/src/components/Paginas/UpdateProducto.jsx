import React from 'react';
import { useEffect, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { useForm, Controller} from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import MarcaService from '../../services/MarcaService';
import CategoriaService from '../../services/CategoriaService';
import { SelectMarca } from './Form/SeleccionarMarca';
import { SelectCategoria } from './Form/SeleccionarCategorias';
import { FormHelperText } from '@mui/material';
import ProductoService from '../../services/ProductoService';
import toast from 'react-hot-toast';
import ImageService from '../../services/ImageService';

export function UpdateProducto() {
  const navigate = useNavigate();
  const routeParams = useParams();
  //Id a actualizar
  const id = routeParams.id || null;
  //Valores a precargar en el formulario desde el API
    const [values, setValores] = useState([]);
    //Obtener del API
      useEffect(() => {
          if(id !=undefined && !isNaN(Number(id))){
          ProductoService.getProductosById(id)
              .then((response) => {
                  setError(response.error);
                  setValores(response.data);})
              .catch((error) => {
                  setError(error);
                  throw new Error('No se pudo obtener el Producto del Servidor');});
      }},[id]);
  let formData=new FormData()
  // Esquema de validación
  const productoSchema = yup.object({
    nombre: yup
          .string(),
    existencias: yup
          .number()
          .transform((value, originalValue) => originalValue === '' ? undefined : value)
          .positive('Deben haber al menos 1'),
    precio: yup
          .number()
          .transform((value, originalValue) => originalValue === '' ? undefined : value)
          .positive('El precio mínimo aceptable es ₡1'),
    descripcion: yup
          .string()
  });
  const {
    control, //register
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre:'',
      marca:'',
      categoria:'',
      existencias:'',
      precio:'',
      descripcion:'',
      image:'',
      idPromocion:''
    },
    // Asignación de validaciones
    resolver: yupResolver(productoSchema),
  });
  //Gestión de errores
  const [error, setError] = useState('');
  // Si ocurre error al realizar el submit
  const onError = (errors, e) => console.log(errors, e);
  // Accion submit
  const onSubmit = (DataForm) => {
    //Para cambiar los nombres enviados en el Json
    const payload ={
      IdProducto: values.IdProducto,    
      NombreProducto: (DataForm.nombre == "" || values.NombreProducto == DataForm.nombre) ? values.NombreProducto : DataForm.nombre,
      Descripcion: (DataForm.descripcion == "" || values.Descripcion == DataForm.descripcion) ? values.Descripcion : DataForm.descripcion,
      Precio: (DataForm.precio === undefined || values.Precio === DataForm.precio) ? values.Precio : DataForm.precio,
      Existencias: (DataForm.existencias === undefined || values.Existencias === DataForm.existencias) ? values.Existencias : DataForm.existencias,
      Marca: (DataForm.marca === "" || values.Marca === DataForm.marca) ? values.Marca : DataForm.marca,
      Categoria: (DataForm.categoria === "" || values.Categoria === DataForm.categoria) ? values.Categoria : DataForm.categoria,
      Imagen: file ? file.name : values.Imagen, // Usa nombre del archivo si hay
      IdPromocion: values.IdPromocion
    };
    console.log('Formulario:');
    console.log(payload);
    //Llamar al API
    try {
       if(productoSchema.isValid()){
        //Crear producto
        ProductoService.updateProducto(payload)
        .then((response)=>{
          setError(response.error)
          //Respuesta al usuario
          if(response.data !=null){
            //Gestionar imagen
            formData.append ("file",file)
            formData.append("IdProducto",response.data.IdProducto)
            ImageService.createImage(formData)
            .then((response)=>{
              setError(response.error)
            })
            .catch((error) => {
              if (error instanceof SyntaxError) {
                console.log(error);
                setError(error);
                throw new Error('Respuesta no válida del servidor');
              }
            })
            toast.success(`Producto #${response.data.IdProducto} - ${response.data.NombreProducto} actualizado`,
                {duration: 4000,position:'top-center'}) 
            return navigate('/product-table/')
            }
        })
        .catch((error) => {
          if (error instanceof SyntaxError) {
            console.log(error);
            setError(error);
            throw new Error('Respuesta no válida del servidor');
          }
        })
      } 
    } catch (error) {
      console.error(error)
    }
  };

//Lista de Marcas
  const [dataMarca, setDataMarca] = useState({});
  const [loadedMarca, setLoadedMarca] = useState(false);
  useEffect(() => {
    MarcaService.getMarcas()
      .then((response) => {
        console.log(response);
        setDataMarca(response.data);
        setLoadedMarca(true);
      })
      .catch((error) => {
        if (error instanceof SyntaxError) {
          console.log(error);
          setError(error);
          setLoadedMarca(false);
          throw new Error('Respuesta no válida del servidor');
        }
      });
  }, []);

  const [marcaNombre, setMarcaNombre] = useState("")
  async function getMarcaNombre(id){
    const response = await MarcaService.getMarcaById(id);
    setMarcaNombre(response.data.Nombre)
    return marcaNombre;
  }
  useEffect (()=>{
    if (values.Marca){
        getMarcaNombre(values.Marca);
    }
  })

//Lista de Categorias
  const [dataCategoria, setDataCategoria] = useState({});
  const [loadedCategoria, setLoadedCategoria] = useState(false);
  useEffect(() => {
    CategoriaService.getCategorias()
      .then((response) => {
        console.log(response);
        setDataCategoria(response.data);
        setLoadedCategoria(true);
      })
      .catch((error) => {
        if (error instanceof SyntaxError) {
          console.log(error);
          setError(error);
          setLoadedMarca(false);
          throw new Error('Respuesta no válida del servidor');
        }
      });
  }, []);

  const [catNombre, setCatNombre] = useState("")
  async function getCatNombre(id){
    const response = await CategoriaService.getCategoriaById(id);
    setCatNombre(response.data.Nombre)
    return catNombre;
  }
  useEffect (()=>{
    if (values.Categoria){
        getCatNombre(values.Categoria);
    }
  })


/* Gestion de imagen */
  const [file,setFile]=useState(null)
  const [fileURL, setFileURL]=useState(null)
  function handleChangeImage(e){
    if(e.target.files){
      setFileURL(
        URL.createObjectURL(e.target.files[0],e.target.files[0].name)
      )
      setFile(e.target.files[0],e.target.files[0].name)
    }
  }
  if (error) return <p>Error: {error.message}</p>;
//GUI de la página
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <Grid container spacing={1}>
          {/*titulo de la pagina*/}
          <Grid>
            <Grid size={12} sm={12}> <Typography variant="h5" gutterBottom>Modificación de Producto: {values.NombreProducto}</Typography> </Grid>
            <label>Cambie los valores que desee modificar y guarde los cambios o regrese a la página anterior para descartar cambios</label>
          </Grid>
          <Grid size={12}></Grid>
          <Grid xs={12} md={4}>
            <label style={{ fontSize: '12px' }}>Nombre actual: {values.NombreProducto}</label>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller name='nombre' control={control}
              render={({field})=>( <TextField {...field} id="nombre" label="Nombre" error={Boolean(errors.nombre)} />)}
            /><FormHelperText sx={{color: '#d32f2f'}}> {errors.nombre ? errors.nombre.message : ' '} </FormHelperText>
            </FormControl>
          </Grid>
          <Grid xs={12} md={4}>
            <label style={{ fontSize: '12px' }}>Existencias actuales: {values.Existencias}</label>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller name="existencias" control={control}
                render={({ field }) => ( <TextField {...field} id="existencias" label="Existencias" error={Boolean(errors.existencias)} /> )}
            /><FormHelperText sx={{color: '#d32f2f'}}> {errors.existencias ? errors.existencias.message : ' '} </FormHelperText>
             </FormControl>
          </Grid>
          <Grid xs={12} md={4}>
            <label style={{ fontSize: '12px' }}>Precio actual: ₡{Number(values.Precio).toLocaleString('en-US')}</label>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller name="precio" control={control}
                render={({ field }) => ( <TextField {...field} id="precio" label="Precio" error={Boolean(errors.precio)} /> )}
            /><FormHelperText sx={{color: '#d32f2f'}}> {errors.precio ? errors.precio.message : ' '} </FormHelperText>
             </FormControl>
          </Grid>
          <Grid size={12}>
            <label style={{ fontSize: '12px' }}>Descripción actual: {values.Descripcion}</label>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller name="descripcion" control={control}
                render={({ field }) => ( <TextField {...field} id="descripcion" label="Descripción" error={Boolean(errors.descripcion)} multiline/> )}
            />
            <FormHelperText sx={{color: '#d32f2f'}}> {errors.descripcion ? errors.descripcion.message : ' '} </FormHelperText>
             </FormControl>
          </Grid>
          {/*Desplegable de Marcas*/}
          <Grid size={4} sm={4}>
            <label style={{ fontSize: '12px' }}>Marca actual: {marcaNombre || "Cargando..."}</label>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              {loadedMarca && (
                <Controller name='marca' control={control} defaultValue=""
                  render={({field})=>( <SelectMarca field={field} data={dataMarca}/> )} /> )}
              <FormHelperText sx={{color: '#d32f2f'}}>
                {errors.marca ? errors.marca.message : ' '}
              </FormHelperText>
            </FormControl>
          </Grid>
          {/*Desplegable de Cats*/}
          <Grid size={4} sm={4}>
            <label style={{ fontSize: '12px' }}>Categoría actual: {catNombre || "Cargando..."}</label>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              {loadedCategoria && (
                <Controller name='categoria' control={control} defaultValue=""
                  render={({field})=>( <SelectCategoria field={field} data={dataCategoria}/> )} /> )}
              <FormHelperText sx={{color: '#d32f2f'}}>
                {errors.categoria ? errors.categoria.message : ' '}
              </FormHelperText>
            </FormControl>
          </Grid>
          {/*Control de imagen del producto*/}
          <Grid size={12} sm={12}>
            <label style={{ fontSize: '12px' }}>Imagen actual: </label>
            <img src={"http://localhost:81/apilyrastools/uploads/"+values.Imagen} alt={values.Imagen} width={200}/>
              <FormControl variant='standard' fullWidth sx={{m:1}}>
                <Controller name='image' control={control}
                  render={({field})=>( <input type='file' {...field} onChange={handleChangeImage} /> )} />
              </FormControl>
              <img src={fileURL} width={300}/>
          </Grid>
          <Grid size={12} sm={12}>
            <Button type="submit" variant="contained" color="secondary" sx={{ m: 1 }} > Guardar Cambios</Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
