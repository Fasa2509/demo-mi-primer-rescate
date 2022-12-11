import { useContext } from 'react';
import { useSnackbar } from 'notistack';
import { Typography } from "@mui/material";

import { AuthContext, ScrollContext } from '../../context';
import { mprApi } from "../../mprApi";
import { validations } from "../../utils";
import styles from './Card.module.css'

export const CardContact = () => {

    const { user } = useContext( AuthContext );
    const { setIsLoading } = useContext( ScrollContext );
    const { enqueueSnackbar } = useSnackbar();
    
    const handleClick = async () => {
        
        if ( !user ) return enqueueSnackbar('Inicia sesión para suscribirte a MPR', { variant: 'warning' });
        if ( !validations.isValidEmail( user.email ) ) return enqueueSnackbar('El correo no es válido', { variant: 'warning' });
        
        try {
            setIsLoading( true );
            const { data } = await mprApi.post('/contact', { email: user?.email });
            setIsLoading( false );
            
            enqueueSnackbar(data.message, { variant: !data.error ? 'success' : 'error' });
        } catch( error ) {
            setIsLoading( false );
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
