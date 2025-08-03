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

export function Signup() {
  const navigate = useNavigate();
  // Esquema de validación
  const loginSchema = yup.object({
    id: yup.number().required('Se requiere una identificación'),
    nombre: yup.string().required('El nombre es requerido'),
    apellido: yup.string().required('El apellido es requerido'),
    fechaNacimiento: yup.date()
              .typeError('La fecha no es valida')
              .required('La fecha es requerida')
              .max(new Date(), 'Fecha no permitida'),
    userName: yup.string().required('El nombre de usuario es requerido'),
    password: yup.string().required('La contraseña es requerida')
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
      fechaNacimiento: '',
      userName: '',
      password: ''
    },
    // Asignación de validaciones
    resolver: yupResolver(loginSchema),
  });

  const [error, setError] = useState(null);
  const notify = () =>
    toast.success('Usuario registrado', {
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
      Tipo: 5,
      UserName: DataForm.userName,
      Password: DataForm.password
    };
    try {
      console.log("Submitting: ");
      console.log(payload);
      //Registrar usuario
      UserService.createUser(payload)
        .then((response) => {
          console.log(response);
          notify();
          return navigate('/user/login/');
        })
        .catch((error) => {
          if (error instanceof SyntaxError) {
            console.log(error);
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
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <Grid container spacing={1}>
          <Grid size={12} sm={12}>
            <Typography variant="h5" gutterBottom>
              Registrar Usuario
            </Typography>
          </Grid>
          <Grid size={12} sm={12}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller name="id" control={control} render={({ field }) => (
                  <TextField {...field} id="id" label="Número de indentificación:" error={Boolean(errors.id)} helperText={errors.id ? errors.id.message : ' '}/>
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={12} sm={6}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller name="nombre" control={control} render={({ field }) => (
                  <TextField {...field} id="nombre" label="Nombre" error={Boolean(errors.nombre)} helperText={errors.nombre ? errors.nombre.message : ' '}/>
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={12} sm={6}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller name="apellido" control={control} render={({ field }) => (
                  <TextField {...field} id="apellido" label="Apellido" error={Boolean(errors.apellido)} helperText={errors.apellido ? errors.apellido.message : ' '}/>
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={12} sm={6}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller name="fechaNacimiento" control={control} render={({ field }) => (
                <TextField {...field} id="fechaNacimiento" label="Fecha de nacimiento" type="date"
                  error={Boolean(errors.fechaNacimiento)} helperText={errors.fechaNacimiento?.message || ' '} />)}
              />
            </FormControl>
          </Grid>
          <Grid size={12} sm={6}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller name="userName" control={control} render={({ field }) => (
                  <TextField {...field} id="userName" label="Nombre de usuario" error={Boolean(errors.userName)} helperText={errors.userName ? errors.userName.message : ' '}/>
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={12} sm={6}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller name="password" control={control} render={({ field }) => (
                  <TextField {...field} id="password" label="Contraseña" type="Password" error={Boolean(errors.password)}
                    helperText={errors.password ? errors.password.message : ' '}/>
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={12} sm={12}>
            <Button type="submit" variant="contained" color="secondary" sx={{ m: 1 }}>Crear usuario</Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
