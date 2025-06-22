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
import { SelectMarca } from './Form/SeleccionarMarca';
import { FormHelperText } from '@mui/material';
import MovieService from '../../services/ProductoService';
import toast from 'react-hot-toast';
import ImageService from '../../services/ImageService';

export function CreateProducto() {
  const navigate = useNavigate();
  let formData=new FormData()
  // Esquema de validación
  const productoSchema = yup.object({
    Nombre: yup
          .string()
          .required('El título es requerido')
          .min(2, "El título debe tener 2 carácteres"),
    time: yup
          .string()
          .required('La duración es requerida'),
    lang: yup
          .string()
          .required('El idioma es requerido'),
    year: yup
          .number()
          .typeError('Solo acepta números')
          .required('El año es requerido')
          .positive('Solo acepta números positivos'),
    director_id: yup
          .number()
          .typeError('Seleccione un director')
          .required('El director es requerido'),
    genres: yup.array().of(yup.number().required('Seleccione un género')).min(1,'Seleccione un género'),
    actors: yup.array().of(yup.object().shape({
      actor_id: yup.number().typeError('El actor es requerido')
            .required('El actor es requerido'),
      role: yup.string().required('El rol es requerido')
    }))
    
  });
  const {
    control, //register
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      'nombre':'',
      'marca':'',
      'categoria':'',
      'existencias':'',
      'precio':'',
      'descripcion':'',
      image:''
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
    console.log('Formulario:');
    console.log(DataForm);
    //Llamar al API
    try {
       if(productoSchema.isValid()){
        //Crear pelicula
        MovieService.createMovie(DataForm)
        .then((response)=>{
          setError(response.error)
          //Respuesta al usuario
          if(response.data !=null){
            //Gestionar imagen
            formData.append ("file",file)
            formData.append("movie_id",response.data.id)
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
            toast.success(
              `Pelicula creada #${response.data.id} - ${response.data.title}`,
              {
                duration: 4000,
                position:'top-center'
              }
            )
            //Redirección tabla de peliculas  
            return navigate('/movie-table')
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
          <Grid size={12} sm={12}> <Typography variant="h5" gutterBottom> Crear Pelicula </Typography> </Grid>
          <Grid xs={12} md={4}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller name='nombre' control={control}
              render={({field})=>( <TextField {...field} id="nombre" label="Nombre" error={Boolean(errors.title)} />)}
            /></FormControl>
          </Grid>
          <Grid xs={12} md={4}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller name="existencias" control={control}
                render={({ field }) => ( <TextField {...field} id="existencias" label="Existencias" error={Boolean(errors.year)} /> )}
            /> </FormControl>
          </Grid>
          <Grid xs={12} md={4}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller name="precio" control={control}
                render={({ field }) => ( <TextField {...field} id="precio" label="Precio" error={Boolean(errors.time)} /> )}
            /> </FormControl>
          </Grid>
          <Grid size={12}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller name="descripcion" control={control}
                render={({ field }) => ( <TextField {...field} id="descripcion" label="Descripción" error={Boolean(errors.lang)} multiline/> )}
            /> </FormControl>
          </Grid>
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

          <Grid size={12} sm={12}>
              <FormControl variant='standard' fullWidth sx={{m:1}}>
                <Controller
                  name='image'
                  control={control}
                  render={({field})=>(
                    <input type='file' {...field} onChange={handleChangeImage} />
                  )}
                />
              </FormControl>
              <img src={fileURL} width={300}/>
          </Grid>
          <Grid size={12} sm={12}>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              sx={{ m: 1 }}
            >
              Guardar
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
