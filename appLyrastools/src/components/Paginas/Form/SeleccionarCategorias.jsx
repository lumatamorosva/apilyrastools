import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

SelectCategoria.propTypes = {
  data: PropTypes.array,
  field: PropTypes.object,
};
export function SelectCategoria({ field, data}) {
    //Para la traducción
    const { t } = useTranslation();
  return (
    <>
      <InputLabel id="categoria">{t('table.cat')} </InputLabel>
      <Select {...field} labelId="categoria" label="Categoria" value={field.value ?? ''}>
        {data && data.map((categoria) => (
          <MenuItem key={categoria.IdCategoria} value={categoria.IdCategoria}> {categoria.Nombre} </MenuItem> ))}
      </Select>
    </>
  );
}
