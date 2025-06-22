import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import PropTypes from 'prop-types';

SelectCategoria.propTypes = {
  data: PropTypes.array,
  field: PropTypes.object,
};
export function SelectCategoria({ field, data}) {
  return (
    <>
      <InputLabel id="categoria"> Categoria </InputLabel>
      <Select {...field} labelId="categoria" label="Categoria" value={field.value ?? ''}>
        {data && data.map((categoria) => (
          <MenuItem key={categoria.idCategoria} value={categoria.Nombre}> {categoria.Nombre} </MenuItem> ))}
      </Select>
    </>
  );
}
