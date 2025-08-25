import React from 'react';
import { useState, useContext, useEffect} from 'react';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { useForm, Controller} from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { FormHelperText } from '@mui/material';
import ReviewService from '../../services/ReviewService';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Box from '@mui/material/Box';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../../context/UserContext';

export function CreateReview() {
    //Para la traducción
    const { t } = useTranslation();
  //Obtener usuario
  const {user, decodeToken}= useContext(UserContext)
  const [userData,setUserData]=useState(decodeToken())
  useEffect(()=>{setUserData(decodeToken())},[user]);

    const {id,name} = useParams();
    const navigate = useNavigate();
  // Esquema de validación
  const reviewSchema = yup.object({
    calificacion: yup
        .number()
        .transform((value, originalValue) => originalValue === '' ? undefined : value)
        .required(t('crearReview.requerido')),
    opinion: yup
        .string()
        .required(t('crearReview.requerido')),
  });
  const {
    control, //register
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      IdProducto:'',
      IdCliente:'',
      Opinion:'',
      Calificacion:''
    },
    // Asignación de validaciones
    resolver: yupResolver(reviewSchema),
  });
  //Gestión de errores
  const [error, setError] = useState('');
  // Si ocurre error al realizar el submit
  const onError = (errors, e) => console.log(errors, e);
  // Accion submit
  const onSubmit = (DataForm) => {
    //Para cambiar los nombres enviados en el Json
    const payload ={
      IdProducto: id,
      IdCliente:  userData.id,
      Opinion: DataForm.opinion,
      Calificacion: DataForm.calificacion,
      Fecha: new Date().toISOString().split('T')[0]
    };
    //Llamar al API
    try {
       if(reviewSchema.isValid()){
        //Crear producto
        ReviewService.createReview(payload)
        .then((response)=>{
          setError(response.error)
          //Respuesta al usuario
          if(response.data !=null){
            toast.success(`${t('crearReview.toast')} ${response.data.IdProducto}`,{duration: 4000,position:'top-center'}) 
            return navigate('/Paginas/Reviews/')
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
  return(
    <>
    <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <Grid container spacing={1}>
          {/*titulo de la pagina*/}
          <Grid size={12}> <Typography variant="h5" gutterBottom>{t('crearReview.title')} {name}</Typography></Grid>
          <Grid>
            <Grid>
              <Typography variant="body2" gutterBottom>{t('crearReview.calificacion')}</Typography>
                <Grid md={12} xs={12}>
                  <FormControl fullWidth sx={{ m: 1 }}>
                    <Controller name="calificacion" control={control} render={({ field }) => (
                        <Box display="flex" alignItems="center">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <Box key={value} onClick={() => field.onChange(value)} sx={{ cursor: 'pointer',
                              color: value <= field.value ? '#2196F3' : '#ccc',}}>
                              {value <= field.value ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />} </Box> ))}
                        </Box> )} />
                    <FormHelperText sx={{ color: '#d32f2f' }}> {errors.calificacion ? errors.calificacion.message : ' '} </FormHelperText>
                  </FormControl>
          </Grid>
            </Grid>
            <Grid>
                  <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
                    <Controller name='opinion' control={control}
                    render={({field})=>( <TextField {...field} id="opinion" label={t('crearReview.opinion')} error={Boolean(errors.opinion)} />)}
                  /><FormHelperText sx={{color: '#d32f2f'}}> {errors.opinion ? errors.opinion.message : ' '} </FormHelperText>
                  </FormControl>
            </Grid>
          </Grid>
        </Grid> 
        <Grid size={12} sm={12}>
            <Button type="submit" variant="contained" color="secondary" sx={{ m: 1 }} >{t('crearReview.someter')}</Button>
        </Grid> 
    </form>
    </>
  )
}