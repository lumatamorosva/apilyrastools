import { useState, useContext } from 'react';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import UserService from '../../services/UserService';
import { UserContext } from '../../context/UserContext';
import { useTranslation } from 'react-i18next';
import { Paper } from '@mui/material';

export function Login() {
    //Para la traducción
    const { t } = useTranslation();
  const navigate = useNavigate();
  const { saveUser } = useContext(UserContext);
  // Esquema de validación
  const loginSchema = yup.object({
    userName: yup.string().required(t('registro.useryup')),
    password: yup.string().required(t('registro.passyup1')),
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // Valores iniciales
    defaultValues: {
      userName: '',
      password: '',
    },
    // Asignación de validaciones
    resolver: yupResolver(loginSchema),
  });

  // Valores de formulario
  const [error, setError] = useState(null);
  // Accion submit
  const onSubmit = (DataForm) => {
    try {
      UserService.loginUser(DataForm)
        .then((response) => {
          console.log(response);
         //Validar la respuesta
         if(response.data !=null && response.data !='undefined' && response.data !='Usuario no valido'){
          //Usuario válido o identificado
          //Guardar el token
          saveUser(response.data)
          toast.success(t('registro.toast2'),{  duration:5000})
          return navigate('/')
         }else{
          //Usuario No válido
          toast.error(t('registro.toast3'),{ duration:5000 })
         }
        })
        .catch((error) => {
          if (error instanceof SyntaxError) {
            console.log(error);
            setError(error);
            throw new Error('Respuesta no válida del servidor');
          }
        });
    } catch (e) {console.error('Error:', e);}
  };
  // Si ocurre error al realizar el submit
  const onError = (errors, e) => console.log(errors, e);

  //Para la función regresar
  const regresar = () => {return navigate('/user/create');};

  if (error) return <p>Error: {error.message}</p>;
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <Grid container spacing={1}>
          <Grid size={12} sm={12}>
            <Typography variant="h5" gutterBottom>{t('registro.title2')}</Typography>
            <Grid container justifyContent="center" alignItems="center">
              <Paper elevation={3} style={{ padding: 20 }}>
                <Grid size={12} sm={4}>
                  {/* ['filled','outlined','standard']. */}
                  <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
                    <Controller name="userName" control={control} render={({ field }) => (
                        <TextField {...field} id="userName" label={t('registro.user')} error={Boolean(errors.email)} 
                        helperText={errors.userName ? errors.userName.message :' '}/>)}/>
                  </FormControl>
                </Grid>
                <Grid size={12} sm={4}>
                  <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
                    <Controller name="password" control={control} render={({ field }) => (
                        <TextField {...field} id="password" label={t('registro.pass')} type="password" error={Boolean(errors.password)}
                          helperText={errors.password ? errors.password.message : ' '}/>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid container size={12} sm={12} justifyContent="center">
                  <Button type="submit" variant="contained" color="secondary" sx={{ m: 1 }}>{t('registro.boton2')}</Button>
                </Grid>
                <Grid container direction="column" alignItems="flex-end" marginTop={'25px'}>
                  <Typography variant="standard" gutterBottom>{t('registro.title3')}</Typography>
                  <Button onClick={() => regresar()} type="submit" variant="contained" color="secondary" sx={{ m: 1 }}>{t('registro.title')}</Button>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
