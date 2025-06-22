import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import PropTypes from 'prop-types';

SelectMarca.propTypes = {
  data: PropTypes.array,
  field: PropTypes.object,
};
export function SelectMarca({ field, data }) {
  return (
    <>
      <InputLabel id="marca">Marca</InputLabel>
        <Select {...field} labelId="marca" label="marca" defaultValue="" >
          {data && data.map((marca) => (
            <MenuItem key={marca.idMarca} value={marca.idMarca}>
              {marca.Nombre}
            </MenuItem>
            ))}
      </Select>
    </>
  );
}
