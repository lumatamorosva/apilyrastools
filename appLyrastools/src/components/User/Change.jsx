import { useState, useContext, useEffect} from 'react';
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

export function Change() {
//Para la traducción
const { t } = useTranslation();
  //Obtener usuario
  const {user, decodeToken}= useContext(UserContext)
  const [userData,setUserData]=useState(decodeToken())
  useEffect(()=>{setUserData(decodeToken())},[user]);
  const navigate = useNavigate();
  const { saveUser } = useContext(UserContext);
  // Esquema de validación
  const loginSchema = yup.object({
    password: yup.string().required(t('registro.passyup1'))
              .min(8, t('registro.passyup2'))
              .matches(/[A-Z]/, t('registro.passyup3'))
              .matches(/\d/, t('registro.passyup4'))
              .matches(/[!@#$%^&*(),.?:{}|<>]/, t('registro.passyup5')),
    passwordc: yup.string().required(t('registro.passyup1'))
                .oneOf([yup.ref('password'), null], 'Las contraseñas no coinciden'),
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // Valores iniciales
    defaultValues: {
        Id: userData.id,
      password: '',
    },
    // Asignación de validaciones
    resolver: yupResolver(loginSchema),
  });

  // Valores de formulario
  const [error, setError] = useState(null);
    // Si ocurre error al realizar el submit
  const onError = (errors, e) => console.log(errors, e);
  // Accion submit
  const onSubmit = (DataForm) => {
    try {
        if(loginSchema.isValid() && !isNaN(DataForm.Id)){
            //Crear producto
            console.log("Enviado", DataForm)
            UserService.changing(DataForm)
                .then((response) => {
                    setError(response.error)
                if(response.data !=null){
                    toast.success(t('registro.toast2'),{  duration:5000})
                    return navigate('/')}
         })
         .catch((error) => {
          if (error instanceof SyntaxError) {
            console.log(error);
            setError(error);
            toast.error(t('registro.toast3'),{ duration:5000 });
          }
        })
        }}catch(error) {
            console.error(error)
            toast.error(t('registro.toast3'),{ duration:5000 })
        }
  };
  //Para la función regresar
  const regresar = () => {return navigate('/');};

  if (error) return <p>Error: {error.message}</p>;
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <Grid container spacing={1}>
          <Grid size={12} sm={12}>
            <Typography variant="h5" gutterBottom>{t('nav.pass')}</Typography>
            <Grid container justifyContent="center" alignItems="center">
              <Paper elevation={3} style={{ padding: 20 }}>
                <Grid size={12} sm={4}>
                  <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
                    <Controller name="password" control={control} render={({ field }) => (
                        <TextField {...field} id="password" label={t('registro.pass')} type="password" error={Boolean(errors.password)}
                          helperText={errors.password ? errors.password.message : ' '}/>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid size={12} sm={4}>
                  <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
                    <Controller name="passwordc" control={control} render={({ field }) => (
                        <TextField {...field} id="passwordc" label={t('registro.pass')} type="password" error={Boolean(errors.passwordc)}
                          helperText={errors.passwordc ? errors.passwordc.message : ' '}/>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid container size={12} sm={12} justifyContent="center">
                  <Button type="submit" variant="contained" color="secondary" sx={{ m: 1 }}>{t('updatePromo.guardar')}</Button>
                  <Button onClick={() => regresar()} type="submit" variant="contained" color="secondary" sx={{ m: 1 }}>{t('tableP.boton')}</Button>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
