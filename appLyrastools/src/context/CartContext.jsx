import * as React from 'react';
import { createContext, useReducer } from 'react';
import { cartReducer, cartInitialState, getTotal, getCountItems, CART_ACTION} from '../reducers/cart';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { useTranslation } from 'react-i18next';

//Traer la promoción
 async function promocionDetalle(id) {
  try {
    const res = await fetch(`http://localhost:81/apilyrastools/promocion/${id}`);
    const data = await res.json();
    const cant = data.Cantidad;
    if (isNaN(cant)) {
      console.warn("Cantidad inválida recibida:", data.Cantidad);
      return 0;
    }
    return cant/100;
  } catch (e) {console.error(e); return 0;}
}

export const CartContext = createContext();

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

//Revisar y ajustar para promociones
async function checkPromotion(producto){
  const ajustado = {...producto};
  if(parseInt(producto.Promocion) !== 0){
    const descuento = await promocionDetalle(producto.IdPromocion)
    ajustado.Precio = (producto.Precio - (producto.Precio * descuento));
  }
  return ajustado;
}
//Función principal para las funciones del carrito
export function CartProvider({ children }) {
    //Para la traducción
    const { t } = useTranslation();
  const [state, dispatch] = useReducer(cartReducer, cartInitialState);
  const addItem = async (producto, cantidad) =>{
    const adjust = await checkPromotion(producto);
    dispatch({ type: CART_ACTION.ADD_ITEM, payload: { ...adjust, cantidad }, });
    toast.success(`${producto.NombreProducto + t('carrito.annadido')}`)
  }
  const removeItem = (producto) =>{
    dispatch({ type: CART_ACTION.REMOVE_ITEM, payload: producto, });
    toast(`${producto.NombreProducto + t('carrito.eliminado')}`, {icon: <RemoveShoppingCartIcon color='warning' />} )
  }
  const cleanCart = () =>{
    dispatch({ type: CART_ACTION.CLEAN_CART, });
    toast(`${t('carrito.vaciado')}`)
  }
  return (
    <CartContext.Provider value={{ cart: state, addItem, removeItem, cleanCart, getTotal, getCountItems, }}>
    {children}  </CartContext.Provider>
  );
}
