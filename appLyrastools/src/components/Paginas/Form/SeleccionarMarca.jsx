import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

SelectMarca.propTypes = {
  data: PropTypes.array,
  field: PropTypes.object,
};
export function SelectMarca({ field, data}) {
      //Para la traducción
      const { t } = useTranslation();
  return (
    <>
      <InputLabel id="marca">{t('table.marca')}</InputLabel>
      <Select {...field} labelId="marca" label="Marca" value={field.value ?? ''}>
        {data && data.map((marca) => (
          <MenuItem key={marca.IdMarca} value={marca.IdMarca}> {marca.Nombre} </MenuItem> ))}
      </Select>
    </>
  );
}
