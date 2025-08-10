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
import { useNavigate } from 'react-router-dom';
import MarcaService from '../../services/MarcaService';
import CategoriaService from '../../services/CategoriaService';
import { SelectMarca } from './Form/SeleccionarMarca';
import { SelectCategoria } from './Form/SeleccionarCategorias';
import { FormHelperText } from '@mui/material';
import ProductoService from '../../services/ProductoService';
import toast from 'react-hot-toast';
import ImageService from '../../services/ImageService';
import { useTranslation } from 'react-i18next';

export function CreateProducto() {
      //Para la traducción
      const { t } = useTranslation();

  const navigate = useNavigate();
  let formData=new FormData()
  // Esquema de validación
  const productoSchema = yup.object({
    nombre: yup
          .string()
          .required(t('newprod.required')),
    existencias: yup
          .number()
          .transform((value, originalValue) => originalValue === '' ? undefined : value)
          .positive(t('newprod.min'))
          .required(t('newprod.required')),
    precio: yup
          .number()
          .transform((value, originalValue) => originalValue === '' ? undefined : value)
          .positive(t('newprod.minprecio'))
          .required(t('newprod.required')),
    descripcion: yup
          .string()
          .required(t('newprod.required')),
    marca: yup
          .number()
          .required(t('newprod.required')),
    categoria: yup
          .number()
          .required(t('newprod.required')),
    calificacion: yup
          .number()
          .transform((value, originalValue) => originalValue === '' ? undefined : value)
          .min(1,t('newprod.min'))
          .max(5,t('newprod.max'))
          .required(t('newprod.required')),
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
      oferta:'',
      idPromocion:'',
      calificacion:''
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
      NombreProducto: DataForm.nombre,
      Descripcion: DataForm.descripcion,
      Precio: DataForm.precio,
      Existencias: DataForm.existencias,
      Marca: DataForm.marca,
      Categoria: DataForm.categoria,
      Imagen: file ? file.name : "Sin imagen", // Usa nombre del archivo si hay
      Oferta: 0,
      IdPromocion: 0,
      Calificacion: DataForm.calificacion
    };
    //Llamar al API
    try {
       if(productoSchema.isValid()){
        //Crear producto
        ProductoService.createProducto(payload)
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
              if(response.data !=null){
                toast.success(response.data,{
                  duration:4000,
                  position: "top-center"
                })
              }
            })
            .catch((error) => {
              if (error instanceof SyntaxError) {
                console.log(error);
                setError(error);
                throw new Error('Respuesta no válida del servidor');
              }
            })
            toast.success(`${t('newprod.toast') + response.data.IdProducto} - ${response.data.NombreProducto}`,
              {duration: 4000,position:'top-center'}
            )
            //Redirección tabla de productos  
            return navigate('/product-table')
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
          <Grid size={12} sm={12}> <Typography variant="h5" gutterBottom> {t('newprod.title')} </Typography> </Grid>
          <Grid xs={12} md={4}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller name='nombre' control={control}
              render={({field})=>( <TextField {...field} id="nombre" label={t('newprod.nombre')} error={Boolean(errors.nombre)} />)}
            /><FormHelperText sx={{color: '#d32f2f'}}> {errors.nombre ? errors.nombre.message : ' '} </FormHelperText>
            </FormControl>
          </Grid>
          <Grid xs={12} md={4}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller name="existencias" control={control}
                render={({ field }) => ( <TextField {...field} id="existencias" label={t('newprod.existencias')} error={Boolean(errors.existencias)} /> )}
            /><FormHelperText sx={{color: '#d32f2f'}}> {errors.existencias ? errors.existencias.message : ' '} </FormHelperText>
             </FormControl>
          </Grid>
          <Grid xs={12} md={4}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller name="precio" control={control}
                render={({ field }) => ( <TextField {...field} id="precio" label={t('newprod.precio')} error={Boolean(errors.precio)} /> )}
            /><FormHelperText sx={{color: '#d32f2f'}}> {errors.precio ? errors.precio.message : ' '} </FormHelperText>
             </FormControl>
          </Grid>
          <Grid xs={12} md={2}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller name="calificacion" control={control}
                render={({ field }) => ( <TextField {...field} id="calificacion" label={t('newprod.calif')} error={Boolean(errors.precio)} /> )}
            /><FormHelperText sx={{color: '#d32f2f'}}> {errors.calificacion ? errors.calificacion.message : ' '} </FormHelperText>
             </FormControl>
          </Grid>
          <Grid size={12}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller name="descripcion" control={control}
                render={({ field }) => ( <TextField {...field} id="descripcion" label={t('newprod.descr')} error={Boolean(errors.descripcion)} multiline/> )}
            />
            <FormHelperText sx={{color: '#d32f2f'}}> {errors.descripcion ? errors.descripcion.message : ' '} </FormHelperText>
             </FormControl>
          </Grid>
          {/*Desplegable de Marcas*/}
          <Grid size={4} sm={4}>
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
              <FormControl variant='standard' fullWidth sx={{m:1}}>
                <Controller name='image' control={control}
                  render={({field})=>( <input type='file' {...field} onChange={handleChangeImage} /> )} />
              </FormControl>
              <img src={fileURL} width={300}/>
          </Grid>
          <Grid size={12} sm={12}>
            <Button type="submit" variant="contained" color="secondary" sx={{ m: 1 }} > {t('newprod.guardar')} </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
