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
import CategoriaService from '../../services/CategoriaService';
import { SelectCategoriaValue } from './Form/SeleccionarCategoriaValue';
import { Box, FormHelperText } from '@mui/material';
import PromocionService from '../../services/PromocionesService';
import toast from 'react-hot-toast';

export function CreatePromocion() {
  const navigate = useNavigate();
  let formData=new FormData()
  // Esquema de validación
  const promoSchema = yup.object({
    nombre: yup
          .string()
          .required('Debe indicar un nombre'),
    cantidad: yup
        .number()
          .transform((value, originalValue) => originalValue === '' ? undefined : value)
          .min(1,'El porcentaje no puede ser menor a 1%')
          .max(100,'El porcentaje no puede ser mayor a 100%')
          .required('Este campo es requerido'),
    descripcion: yup
          .string()
          .required('La descripción es requerida'),
    fechaInicio: yup.date()
          .typeError('La fecha no es valida')
          .required('La fecha es requerida')
          .min(new Date(), 'La fecha debe ser posterior a hoy'),
    fechaFinal: yup.date()
          .typeError('La fecha no es valida')
          .required('La fecha es requerida')
          .min(yup.ref('fechaInicio'), 'La fecha debe ser posterior a la fecha de inicio'),
    aplicaA: yup
          .string()
          .required('Seleccione una categoria de la lista')
  });
  const {
    control, //register
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre:'',
      descripcion:'',
      fechaInicio:'',
      fechaFinal:'',
      aplicaA:'',
      cantidad:''
    },
    // Asignación de validaciones
    resolver: yupResolver(promoSchema),
  });
  //Gestión de errores
  const [error, setError] = useState('');
  // Si ocurre error al realizar el submit
  const onError = (errors, e) => console.log(errors, e);
  // Accion submit
  const onSubmit = (DataForm) => {
    //Para cambiar los nombres enviados en el Json
    const payload ={
      Nombre: DataForm.nombre,
      Descripcion: DataForm.descripcion,
      FechaInicio: DataForm.fechaInicio,
      FechaFinal: DataForm.fechaFinal,
      IdCreador: 1, //Cambiar cuando haya login
      AplicaA: DataForm.aplicaA,
      Cantidad: DataForm.cantidad
    };
    console.log('Formulario:');
    console.log(payload);
    //Llamar al API
    try {
       if(promoSchema.isValid()){
        //Crear producto
        PromocionService.createPromocion(payload)
        .then((response)=>{
          setError(response.error)
          //Respuesta al usuario
          if(response.data !=null){
            toast.success(
              `Promoción nueva creada #${response.data.IdPromocion} - ${response.data.Nombre}`,
              {duration: 4000,position:'top-center'}) 
            return navigate('/Paginas/ListPromociones/')
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
          throw new Error('Respuesta no válida del servidor');
        }
      });
  }, []);

  if (error) return <p>Error: {error.message}</p>;
//GUI de la página
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <Grid container spacing={1}>
          {/*titulo de la pagina*/}
          <Grid size={12}> <Typography variant="h5" gutterBottom>Crear Nueva Promoción</Typography> </Grid>
          <Grid xs={12} md={6}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller name='nombre' control={control}
              render={({field})=>( <TextField {...field} id="nombre" label="Nombre" error={Boolean(errors.nombre)} />)}
            /><FormHelperText sx={{color: '#d32f2f'}}> {errors.nombre ? errors.nombre.message : ' '} </FormHelperText>
            </FormControl>
          </Grid>
          <Grid md={12} xs={12}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller name='cantidad' control={control}
                render={({field})=>( <TextField {...field} id="cantidad" label="Cantidad a descontar" type='number'inputProps={{min:1, max:100}}
                error={Boolean(errors.nombre)} />)}
            /><FormHelperText sx={{color: '#d32f2f'}}> {errors.cantidad ? errors.cantidad.message : ' '} </FormHelperText>
            </FormControl>
          </Grid>
          <Grid size={12}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller name="descripcion" control={control}
                render={({ field }) => ( <TextField {...field} id="descripcion" label="Descripción" error={Boolean(errors.descripcion)} multiline/> )}
            />
            <FormHelperText sx={{color: '#d32f2f'}}> {errors.descripcion ? errors.descripcion.message : ' '} </FormHelperText>
             </FormControl>
          </Grid>
          {/*Desplegable de Cats*/}
          <Grid size={4} sm={4}>
            <Typography>Aplicar a:</Typography>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              {loadedCategoria && (
                <Controller name='aplicaA' control={control} defaultValue=""
                  render={({field})=>( <SelectCategoriaValue field={field} data={dataCategoria}/> )} /> )}
              <FormHelperText sx={{color: '#d32f2f'}}>
                {errors.aplicaA ? errors.aplicaA.message : ' '}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid size={12}></Grid>
          <Grid md={6} xs={12}>
                <Box>
                    <Grid xs={12}>
                    <Typography>Fecha de aplicación:</Typography>
                    <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
                    <Controller name='fechaInicio' control={control}
                        render={({ field })=>(<input {...field} style={{fontSize: '16px',height: '55px', borderColor:"#c2c2c2",
                        borderRadius:'5px'}} id="fechaInicio" type='date'></input>)}
                    /><FormHelperText sx={{color: '#d32f2f'}}> {errors.fechaInicio ? errors.fechaInicio.message : ' '} </FormHelperText>
                    </FormControl>
                </Grid>
                <Grid xs={12}>
                    <Typography>Fecha de expiración:</Typography>
                    <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
                    <Controller name='fechaFinal' control={control}
                        render={({ field })=>(<input {...field} style={{fontSize: '16px', height: '55px', borderColor:"#c2c2c2", borderRadius:'5px'}} 
                        id="fechaFinal" type='date'></input>)}
                    /><FormHelperText sx={{color: '#d32f2f'}}> {errors.fechaFinal ? errors.fechaFinal.message : ' '} </FormHelperText>
                    </FormControl>
                </Grid>
                </Box>
          </Grid>
          <Grid size={12} sm={12}>
            <Button type="submit" variant="contained" color="secondary" sx={{ m: 1 }} > Crear Promoción</Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
