import React from 'react';
import { useEffect, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { useForm, Controller} from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import CategoriaService from '../../services/CategoriaService';
import { SelectCategoriaValue } from './Form/SeleccionarCategoriaValue';
import { Box, FormHelperText } from '@mui/material';
import PromocionService from '../../services/PromocionesService';
import toast from 'react-hot-toast';

export function CreateReview() {
    
}