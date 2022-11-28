import { useContext } from 'react';
import { useSnackbar } from 'notistack';
import { TextField, Typography } from "@mui/material";

import { AuthContext } from '../../context';
import { mprApi } from "../../mprApi";
import { validations } from "../../utils";
import styles from './Card.module.css'

export const CardContact = () => {

    const { user } = useContext( AuthContext );
    const { enqueueSnackbar } = useSnackbar();
    
    const handleClick = async () => {
        
        if ( !validations.isValidEmail( user ? user.email : '' ) ) return enqueueSnackbar('El correo no es válido', { variant: 'error' });
        
        try {
            const res = await mprApi.post('/contact', { email: user?.email });

            enqueueSnackbar(res.data.message, { variant: 'success' });
        } catch( error ) {
            // @ts-ignore
            enqueueSnackbar(error.response ? error.response.data.message || 'Ocurrió un error' : 'Ocurrió un error', { variant: 'error' });
        }
    }
    
    return (
    <div className={ styles.card }>
        <Typography sx={{ fontSize: '1.15rem', fontWeight: '600' }}>Mantente informado</Typography>

        <p>¡Sigue al día sobre nuestro proyecto!</p>
        <p>Recibe información exclusiva de nuestra fundación en tu correo</p>

        <button style={{ marginBottom: 0, marginTop: '.8rem' }} className='button' onClick={ handleClick }>¡Suscríbete!</button>
    </div>
  )
}
