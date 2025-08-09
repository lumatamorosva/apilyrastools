import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import {ReviewCard} from './Form/ReviewCard';
import FormControl from '@mui/material/FormControl';
import { useForm, Controller} from 'react-hook-form';
import { FormHelperText } from '@mui/material';
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function Reviews() {
  //Para la traducción
  const { t } = useTranslation();
  //Url para acceder a la imagenes guardadas en el API
  const BASE_URL = import.meta.env.VITE_BASE_URL + 'uploads';
  const {control,formState: {},} = useForm({});
  //Traer las opiniones:
      const [opiniones, setOpiniones] = useState([]);
      useEffect(() =>{
      fetch(`http://localhost:81/apilyrastools/opiniones`)
              .then((res) => res.json())
              .then(data => setOpiniones(data));
      },[]);
  return (
    <>
    <Typography variant="h6" gutterBottom>{t('review.title')}</Typography>
    <Grid container spacing={1} display="flex" flexWrap="wrap" justifyContent={"center"}>
        {/* ()=>{} */}
        {opiniones.map((item) => (
          <Grid size={4} key={item.id} width='250px' >
            {/*Tarjeta*/}
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              {(<Controller name='tarjeta' control={control} defaultValue=""
                render={({field})=>( <ReviewCard field={field} data={item}/> )} /> )}
              <FormHelperText sx={{color: '#d32f2f'}}></FormHelperText>
            </FormControl>
          </Grid>
        ))}
    </Grid>
    </>
  );
}
