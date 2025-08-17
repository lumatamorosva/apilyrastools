import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import { Controller} from 'react-hook-form';
import { FormHelperText } from '@mui/material';
import { useForm } from 'react-hook-form';
import {InputLabel, MenuItem, Select } from '@mui/material';
import TextField from '@mui/material/TextField';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useContext, useEffect, useState } from "react";
import toast from 'react-hot-toast';
import PedidoService from "../../services/PedidoService";
import { useNavigate} from "react-router-dom";

//Estilo de la ventana emergente
  const stylePopup = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    maxWidth: '700px',
    minWidth: '400px',
    height: '90%',
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  };

  export default function EmergentePago({lang, pago, id, open, onClose}) {
      const t = lang;
      const IdFactura = id;
      const [valor, setValor] = useState(0);
        const manejarCambio = (event) => {setValor(event.target.value);}
        const [monto, setMonto] = useState(0);
    //Enlaces o redireccionar
        const navigate = useNavigate();
      // Esquema de validación
      const schema = yup.object({
        nombre: yup
              .string()
              .required(t('newprod.required')),
        no: yup
              .number()
              .min(9999999999999,t('newprod.min'))
              .required(t('newprod.required')),
        code: yup
              .number()
              .min(999,t('newprod.min'))
              .required(t('newprod.required')),
        mes: yup
              .number()
              .required(t('newprod.required'))
              .min((new Date().getMonth())+1, t('newPromo.fechaposterior')),
        anno: yup
              .number()
              .required(t('newprod.required'))
              .min((new Date().getYear()), t('newPromo.fechaposterior')),
      });
      // Esquema de validación
      const schemaCash = yup.object({
        monto: yup
              .number()
              .min(pago,t('newprod.min'))
              .required(t('newprod.required'))
      });
      const schemaToUse = valor == 2 ? schemaCash : schema;
      const {control, handleSubmit,formState: { errors },} = useForm({resolver: yupResolver(schemaToUse)});
      //Gestión de errores
        const [error, setError] = useState('');
      const onSubmit = () => {
        try{
            if(schemaToUse.isValid()){
                const payload ={
                IdPedido: IdFactura,
                Estado: 2,
                Fecha: new Date(),};
                if(valor == 1){
                    PedidoService.updatePedido(payload)
                        .then((response)=>{setError(response.error);})
                        console.log("A actualizar:" , payload);
                    toast.success(`${t('pago.toast')}`,{duration: 4000, position:'top-center'});
                    navigate('/Paginas/PedidosList');
                }else{
                    if(monto >= pago){
                        PedidoService.updatePedido(payload)
                        .then((response)=>{setError(response.error);})
                        console.log("A actualizar:" , payload);
                        const saldo = monto - pago;
                        toast.success(`${t('pago.toast2')} ${saldo}`,{duration: 4000, position:'top-center'});
                        navigate('/Paginas/PedidosList');
                    }
                }
            }
        }catch(error){
            console.log(error);
        }
      }
    
  return (
    
    <Modal open={open} onClose={onClose} aria-describedby="modal-descripcion" >
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Box sx={stylePopup}>
        <Typography marginBottom={3} variant="h5" gutterBottom>{t('pago.title')}</Typography>
        <Box display="flex" gap="10px">
          <Typography>{t('pago.select')}</Typography>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">{t('pago.opcion')}</InputLabel>
            <Select labelId="demo-simple-select-label" id="demo-simple-select" value={valor} onChange={manejarCambio}>
                <MenuItem value={1}>{t('pago.tarjeta')}</MenuItem>
                <MenuItem value={2}>{t('pago.efectivo')}</MenuItem>
            </Select>
            </FormControl>
            
        </Box>
        {valor == 1 && <Box margin={2} border="1px solid" borderRadius={2} padding={1} display="flex" alignItems="center" flexDirection='column'>
            <label>{t('pago.monto')}  ₡ {pago.toLocaleString('en-US')}</label>
            <FormControl sx={{ width: '70%' }} >
                <Controller name="nombre" control={control} render={({field}) => (<><TextField {...field}
                 sx={{ width: '100%', margin:'6px'}} id="nombre" label={t('pago.nombre')} error={Boolean(errors.nombre)}/>
                 <FormHelperText sx={{color: '#d32f2f'}}>{errors.nombre ? errors.nombre.message : ' '} </FormHelperText></>)}/>
            </FormControl>
            <FormControl sx={{ width: '70%' }} >
                <Controller name="no" control={control} render={({field}) => (<>
                <TextField {...field} sx={{ width: '100%', margin:'6px' }} id="tarjeta" label={t('pago.no')} error={Boolean(errors.no)}/>
                <FormHelperText sx={{color: '#d32f2f'}}> {errors.no ? errors.no.message : ' '} </FormHelperText></>)}/>
            </FormControl>
            <Box display="flex" gap={1} width="70%">
                <FormControl variant="standard" sx={{ width: '45%' }} >
                <Controller name="mes" control={control} render={({ field }) => (<TextField sx={{ width: '100%', margin:'6px' }} {...field} id="mes" 
                    inputProps={{min: 1,max: 12}} label={t('pago.mes')} type="number" error={Boolean(errors.mes)} />)}/>
                </FormControl><FormHelperText sx={{color: '#d32f2f'}}> {errors.mes ? errors.mes.message : ' '} </FormHelperText>
                <FormControl variant="standard" sx={{ width: '45%' }} >
                <Controller name="anno" control={control} render={({ field }) => (<TextField sx={{ width: '100%', margin:'6px' }} {...field} id="anno" 
                    inputProps={{min: 2025,max: 2030}} label={t('pago.anno')} type="number" error={Boolean(errors.anno)} />)}/>
                </FormControl><FormHelperText sx={{color: '#d32f2f'}}> {errors.anno ? errors.anno.message : ' '} </FormHelperText>
            </Box>
            <FormControl sx={{ width: '70%' }} >
                <Controller name="code" control={control} render={({field}) => (<>
                <TextField {...field} sx={{ width: '100%', margin:'6px' }} id="code" label={t('pago.cod')} error={Boolean(errors.code)}/>
                <FormHelperText sx={{color: '#d32f2f'}}> {errors.code ? errors.code.message : ' '} </FormHelperText></>)}/>
            </FormControl>
        </Box>}
        {valor == 2 && <Box margin={2} border="1px solid" borderRadius={2} padding={1} display="flex" alignItems="center" flexDirection='column'>
            <label>{t('pago.monto')}  ₡ {pago.toLocaleString('en-US')}</label>
            <FormControl variant="standard" sx={{ width: '70%' }} >
                <Controller name="monto" control={control} render={({ field }) => (<>
                    <TextField {...field} sx={{ width: '100%', margin:'6px' }} id="monto" inputProps={{min: pago}} label={t('pago.monto')}
                    type="number" error={Boolean(errors.monto)} onChange={(e) => {field.onChange(e); setMonto(e.target.value);}} value={field.value}/>
                    <FormHelperText sx={{color: '#d32f2f'}}> {errors.monto ? errors.monto.message : ' '} </FormHelperText></>)}/>
            </FormControl>
        </Box>}
        <Box>
            <Button type="submit" variant="contained" color="secondary" sx={{ m: 1 }}>{t('pago.proceder')}</Button>
            <Button variant="contained" onClick={onClose}>{t('emergente.cerrar')}</Button>
        </Box>
      </Box>
      </form>
    </Modal>
  );
}