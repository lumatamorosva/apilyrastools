/* eslint-disable no-unused-vars */
import React from 'react';
import { useEffect, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import UserService from '../../services/UserService';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { Paper } from '@mui/material';

export function Signup() {
    //Para la traducción
    const { t } = useTranslation();
  const navigate = useNavigate();
  // Esquema de validación
  const loginSchema = yup.object({
    id: yup.number(t('registro.id1yup')).required(t('registro.idyup')),
    nombre: yup.string().required(t('registro.nombreyup')),
    apellido: yup.string().required(t('registro.apellidoyup')),
    mail: yup.string().email(t('registro.apellidoyup')).required(t('registro.mailyup')),
    fechaNacimiento: yup.date()
              .typeError(t('registro.fechayup'))
              .required(t('registro.fechayup2'))
              .max(new Date(), t('registro.fechayup3')),
    userName: yup.string().required(t('registro.useryup')),
    password: yup.string().required(t('registro.passyup1'))
              .min(8, t('registro.passyup2'))
              .matches(/[A-Z]/, t('registro.passyup3'))
              .matches(/\d/, t('registro.passyup4'))
              .matches(/[!@#$%^&*(),.?:{}|<>]/, t('registro.passyup5')),
  });
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    // Valores iniciales
    defaultValues: {
      id: '',
      nombre: '',
      apellido: '',
      mail: '',
      fechaNacimiento: '',
      userName: '',
      password: ''
    },
    // Asignación de validaciones
    resolver: yupResolver(loginSchema),
  });

  const [error, setError] = useState(null);
  const notify = () =>
    toast.success(t('registro.toast'), {
      duration: 4000,
      position: 'top-center',
    });
  // Accion submit
  const onSubmit = (DataForm) => {
    const payload ={
      IdUsuario: DataForm.id,
      Nombre: DataForm.nombre,
      Apellido: DataForm.apellido,
      FechaNacimiento: new Date(DataForm.fechaNacimiento).toISOString().split('T')[0],
      Email: DataForm.mail,
      Tipo: 5,
      UserName: DataForm.userName,
      Password: DataForm.password
    };
    try {
      //Registrar usuario
      UserService.createUser(payload)
        .then((response) => {
          notify();
          return navigate('/user/login/');
        })
        .catch((error) => {
          if (error instanceof SyntaxError) {
            setError(error);
            throw new Error('Respuesta no válida del servidor');
          }
        });
    } catch (e) {
      // handle your error
    }
  };

  // Si ocurre error al realizar el submit
  const onError = (errors, e) => console.log(errors, e);

  if (error) return <p>Error: {error.message}</p>;

    //Para la función regresar
    const regresar = () => {return navigate('/user/login');};


  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <Grid container spacing={1}>
          <Grid size={12} sm={12}>
            <Typography variant="h5" gutterBottom>{t('registro.title')}</Typography>
            <Grid container justifyContent="center" alignItems="center">
              <Paper elevation={3} style={{ padding: 20 }}>
                <Grid size={12} sm={12}>
                  <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
                    <Controller name="id" control={control} render={({ field }) => (
                        <TextField {...field} id="id" label={t('registro.id')} error={Boolean(errors.id)} helperText={errors.id ? errors.id.message : ' '}/>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid size={12} sm={6}>
                  <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
                    <Controller name="nombre" control={control} render={({ field }) => (
                        <TextField {...field} id="nombre" label={t('registro.nombre')} error={Boolean(errors.nombre)} helperText={errors.nombre ? errors.nombre.message : ' '}/>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid size={12} sm={6}>
                  <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
                    <Controller name="apellido" control={control} render={({ field }) => (
                        <TextField {...field} id="apellido" label={t('registro.apellido')} error={Boolean(errors.apellido)} helperText={errors.apellido ? errors.apellido.message : ' '}/>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid size={12} sm={6}>
                  <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
                    <Controller name="fechaNacimiento" control={control} render={({ field }) => (
                      <TextField {...field} id="fechaNacimiento" label={t('registro.fecha')} type="date"
                        error={Boolean(errors.fechaNacimiento)} helperText={errors.fechaNacimiento?.message || ' '} />)}
                    />
                  </FormControl>
                </Grid>
                <Grid size={12} sm={6}>
                  <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
                    <Controller name="mail" control={control} render={({ field }) => (
                        <TextField {...field} id="mail" label={t('registro.mail')} error={Boolean(errors.mail)} helperText={errors.mail ? errors.mail.message : ' '}/>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid size={12} sm={6}>
                  <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
                    <Controller name="userName" control={control} render={({ field }) => (
                        <TextField {...field} id="userName" label={t('registro.user')} error={Boolean(errors.userName)} helperText={errors.userName ? errors.userName.message : ' '}/>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid size={12} sm={6}>
                  <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
                    <Controller name="password" control={control} render={({ field }) => (
                        <TextField {...field} id="password" label={t('registro.pass')} type="Password" error={Boolean(errors.password)}
                          helperText={errors.password ? errors.password.message : ' '}/>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid container size={12} sm={12} justifyContent="center">
                  <Button type="submit" variant="contained" color="secondary" sx={{ m: 1 }}>{t('registro.boton')}</Button>
                </Grid>
                <Grid container direction="column" alignItems="flex-end" marginTop={'25px'}>
                  <Typography variant="standard" gutterBottom>{t('registro.title4')}</Typography>
                  <Button onClick={() => regresar()} type="submit" variant="contained" color="secondary" sx={{ m: 1 }}>{t('registro.title2')}</Button>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
