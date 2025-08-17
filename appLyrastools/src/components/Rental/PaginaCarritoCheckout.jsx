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
import { useTranslation } from 'react-i18next';
import PedidoService from "../../services/PedidoService";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";

export function CreateCarrito() {
  //Para la traducción
    const { t } = useTranslation();
    //Obtener usuario
    const {user, decodeToken,autorize}= useContext(UserContext);
    const [userData,setUserData]=useState(decodeToken()); 
    useEffect(()=>{setUserData(decodeToken())},[user]);
    const navigate = useNavigate();
    // Obtener fecha actual en formato dd/MM/yyyy
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    // Esquema de validación
    const pedidoSchema = yup.object({
      idEntrega: yup
      .number()
      .required('El cliente es requerido')
    });
    const {cart,getTotal,cleanCart }=useCart()
    const {handleSubmit,formState: { errors },
      } = useForm({
        defaultValues: {
          idCliente: userData.id,
          fechaCreacion: currentDate,
          estado: 1,
          total: getTotal(cart),
          idEntrega: 1,
          //**Detalles de compra
          productos: cart,
        },
    // Asignación de validaciones
    resolver: yupResolver(pedidoSchema),
  });
  const [error, setError] = useState('');
  // Si ocurre error al realizar el submit
  const onError = (errors, e) => console.log(errors, e);
  // Accion submit
  const onSubmit = (DataForm) => {
    try {
      const { productos, ...pedido } = DataForm;
      const jsonToSend = {pedido: pedido,detalles: productos};
        //Crear
        PedidoService.create(jsonToSend).then((response)=>{setError(response.error)
          //Respuesta al usuario
          if(response.data !=null){
            toast.success(`Pedido creado # ${response.data[0].idFactura}`);
            cleanCart();
            navigate('/Paginas/PedidosList');
        }})    
    } catch (e) {console.error(e);}
  };

  if (error) return <p>Error: {error.message}</p>;
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
          <Grid size={12} sm={8}>
            <Typography variant="h5" gutterBottom>{t('carrito.title')}</Typography>
            <Cart/>
          </Grid>
          <Button type="submit" variant="contained" >{t('carrito.generar')}</Button>
      </form>
    </>
  );
}
