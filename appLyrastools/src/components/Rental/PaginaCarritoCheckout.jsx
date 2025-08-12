import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { useForm} from 'react-hook-form';
import Button from '@mui/material/Button';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {  useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Cart } from './Cart';
import { format, parse } from 'date-fns';
import UserService from '../../services/UserService';
import { useCart } from '../../hooks/useCart';
//https://www.npmjs.com/package/@hookform/resolvers

export function CreateCarrito() {
  const navigate = useNavigate();
// Obtener fecha actual en formato dd/MM/yyyy
const currentDate = format(new Date(), 'dd/MM/yyyy');
  // Esquema de validación
  const movieRentalSchema = yup.object({
    customer_id: yup
      .number()
      .typeError('Seleccione un cliente')
      .required('El cliente es requerido'),
    rental_date: yup
      .string()
      .required('Especifique una fecha')
      .matches(/^([0-2][0-9]|3[0-1])(\/|-)(0[1-9]|1[0-2])\2(\d{4})$/,'Formato día/mes/año dd/mm/yyyy')
      .test('is-future-date', 'La fecha no puede ser menor a la actual', (value) => {
        const inputDate = parse(value, 'dd/MM/yyyy', new Date());
        const today = parse(currentDate, 'dd/MM/yyyy', new Date());
        return inputDate >= today;
      })
  });
  const {cart,getTotal }=useCart()
  const {
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      shop_id: '',
      shop_name: '',
      customer_id: '',
      rental_date: currentDate,
      //**Detalle de compra
      movies: cart,
      total: 0,
    },
    // Asignación de validaciones
    resolver: yupResolver(movieRentalSchema),
  });
  const [error, setError] = useState('');
  // Si ocurre error al realizar el submit
  const onError = (errors, e) => console.log(errors, e);
  // Accion submit
  const onSubmit = (data) => {
    try {
      if (movieRentalSchema.isValid()) {
          const total = getTotal(cart); 
          toast.success('Alquiler creado #${response.data.id'); 
          console.log('Formulario:',dataForm);       
        }
    } catch (e) {
      //Error
      console.error(e);
    }
  };

  if (error) return <p>Error: {error.message}</p>;
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
          {/*Titulo "Articulos en el carrito*/}
          <Grid size={12} sm={8}>
            <Typography variant="h5" gutterBottom> Artículos en el carrito</Typography>
            {/* Detalles de Artículos cargados*/}
            <Cart/>
          </Grid>
          {/*boton submit*/}
          <Grid size={12} sm={12}>
            <Button type="submit" variant="contained" >Proceder con el pago</Button>
          </Grid>
      </form>
    </>
  );
}
