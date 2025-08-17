import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell,{ tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { useCart } from '../../hooks/useCart';
import { useTranslation } from 'react-i18next';

CartItem.propTypes = {
  item: PropTypes.object,
  removeItem: PropTypes.func,
};
//Estilo de Tabla
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.common.white,
    fontSize: 16,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
  [`&.${tableCellClasses.footer}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontSize: 16,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({'&:nth-of-type(odd)': {backgroundColor: theme.palette.action.hover,},
  // hide last border
  '&:last-child td, &:last-child th': {border: 0,},
}));
function CartItem({item, removeItem}) {
  //Para la traducción
  const { t } = useTranslation();
  return (
    <StyledTableRow key={item.IdProducto} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <StyledTableCell component="th" scope="row"> {item.NombreProducto} </StyledTableCell>
      <StyledTableCell>₡{Number(item.Precio).toLocaleString('en-US')}</StyledTableCell>
      <StyledTableCell align="center">{item.cantidad}</StyledTableCell>
      <StyledTableCell>₡{Number(item.subtotal).toLocaleString('en-US')}</StyledTableCell>
      <StyledTableCell align="right">
        <Tooltip title={t('carrito.eliminar') + item.NombreProducto}>
          <IconButton color="warning" onClick={() => removeItem(item)} aria-label={t('carrito.eliminar')+item.NombreProducto}>
          <DeleteIcon />
          </IconButton>
        </Tooltip>
      </StyledTableCell>
    </StyledTableRow>
  );
}

//Detalle Compra
export function Cart() {
    //Para la traducción
  const { t } = useTranslation();
  const {cart, removeItem, cleanCart, getTotal}=useCart()
  return (
    <>
      <Tooltip title={t('carrito.title')}>
        <IconButton color="error" onClick={()=>cleanCart()} > <RemoveShoppingCartIcon /> </IconButton>
      </Tooltip>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead >
            <TableRow>
              <StyledTableCell>{t('carrito.producto')}</StyledTableCell>
              <StyledTableCell>{t('carrito.precio')}</StyledTableCell>
              <StyledTableCell>{t('carrito.cantidad')}</StyledTableCell>
              <StyledTableCell>{t('carrito.subtotal')}</StyledTableCell>
              <StyledTableCell align="right">{t('carrito.eliminar')}</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Lista de lineas de detalle de la compra */}
            {cart.map((row)=>(<CartItem key={row.id} item={row} removeItem={()=>removeItem(row)} {...row}/>))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <StyledTableCell colSpan={4} align="right">
                <Typography variant="subtitle1" gutterBottom> Total </Typography>
              </StyledTableCell>
              {/* Mostrar total */}
              <StyledTableCell colSpan={3}>
                <Typography variant="subtitle1" gutterBottom>₡{Number(getTotal(cart)).toLocaleString('en-US')}</Typography>
              </StyledTableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
}
