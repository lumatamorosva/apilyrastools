import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import {ReviewCard} from './Form/ReviewCard';
import FormControl from '@mui/material/FormControl';
import { useForm, Controller} from 'react-hook-form';
import { FormHelperText } from '@mui/material';

export function Reviews() {
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
    <Grid display="flex" flexWrap="wrap" justifyContent={"center"}>
        {/* ()=>{} */}
        {opiniones.map((item) => (
          <Grid size={8} key={item.id} minWidth='250px'>
            {/*Tarjeta*/}
              <Grid size={4} sm={4}>
                <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
                  {(<Controller name='tarjeta' control={control} defaultValue=""
                      render={({field})=>( <ReviewCard field={field} data={item}/> )} /> )}
                  <FormHelperText sx={{color: '#d32f2f'}}></FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
        ))}
    </Grid>
    </>
  );
}
