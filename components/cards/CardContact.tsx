import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { TextField, Typography } from "@mui/material";

import { mprApi } from "../../mprApi";
import { validations } from "../../utils";
import styles from './Card.module.css'

export const CardContact = () => {

    const [email, setEmail] = useState('');
    const { enqueueSnackbar } = useSnackbar();
    
    const handleClick = async () => {
        
        if ( !validations.isValidEmail( email ) ) return enqueueSnackbar('El correo no es válido', { variant: 'error' });
        
        try {
            const res = await mprApi.post('/contact', { email });

            enqueueSnackbar(res.data.message, { variant: 'success' });
        } catch( error ) {
            // @ts-ignore
            enqueueSnackbar(error.response ? error.response.data.message || 'Ocurrió un error' : 'Ocurrió un error', { variant: 'error' });
        }
    }
    
    return (
    <div className={ styles.card }>
        <Typography sx={{ fontSize: '1.15rem', fontWeight: '600' }}>Mantente informado</Typography>

        <Typography>¡Sigue al día sobre nuestro proyecto!</Typography>

        <TextField label='Correo electrónico' placeholder="Escribe tu correo" variant="filled" color='secondary' fullWidth onChange={ ({ target }) => setEmail( target.value ) } />

        <button style={{ marginBottom: 0, marginTop: '.8rem' }} className='button' onClick={ handleClick }>¡Suscríbete!</button>
    </div>
  )
}
