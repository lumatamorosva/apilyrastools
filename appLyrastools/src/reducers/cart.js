import { Update } from "@mui/icons-material";

export const cartInitialState = JSON.parse(localStorage.getItem('cart')) || [];
export const CART_ACTION = { ADD_ITEM: 'ADD_ITEM', REMOVE_ITEM: 'REMOVE_ITEM', CLEAN_CART: 'CLEAN_CART'};
//Actualizar localstorage
export const updateLocalStorage = (state) => { localStorage.setItem('cart', JSON.stringify(state));};
// Función para calcular el subtotal de cada ítem
const calculateSubtotal = (item, cantidad) => item.Precio * cantidad;
// Función para calcular el total del carrito
const calculateTotal = (cart) => cart.reduce((acc, item) => acc + item.subtotal, 0);
//Reducer carrito de compras
//state: estado previo
//retorna un nuevo estado
export const cartReducer = (state, action) => {
  //type: acción a realizar para cambiar el estado
  //payload: datos que necesita la acción
  const { type: actionType, payload: actionPayload } = action;
  switch (actionType) {
    //Agregar un item a la compra
    case CART_ACTION.ADD_ITEM: {
      //Verificar sí existe
      const productInCart = state.find((item)=>item.IdProducto === action.payload.IdProducto);
      //Actualizar carrito si el producto existe
      if (productInCart) {
        const newState = state.map((item)=>
          item.IdProducto === action.payload.IdProducto? {...item,cantidad:item.cantidad+action.payload.cantidad,
          subtotal: calculateSubtotal(item,item.cantidad+action.payload.cantidad)}:item);
        updateLocalStorage(newState);
        return newState;
      //Agregar producto nuevo
      }else{
        const newItem = {...action.payload,subtotal: calculateSubtotal(action.payload, action.payload.cantidad),};
        const newState = [...state, newItem];
        updateLocalStorage(newState);
        return newState;
      }
    }
    //Eliminar item de la compra
    case CART_ACTION.REMOVE_ITEM: {
      const newState = state.filter((item) => item.IdProducto !== action.payload.IdProducto);
      updateLocalStorage(state);
      return newState;
    }
    //Eliminar el carrito completo
    case CART_ACTION.CLEAN_CART:
      {updateLocalStorage([]); return []; }
    default:
      return state;
  }
};
export const getTotal = (state) => {
  return calculateTotal(state);
};
export const getCountItems = (state) => {
  return state.reduce((acc) => acc + 1, 0);
};
