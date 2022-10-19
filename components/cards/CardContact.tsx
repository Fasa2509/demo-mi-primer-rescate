import { useState } from "react"
import { useSnackbar } from "notistack"
import styles from './Card.module.css'
import { isValidEmail } from "../../utils/validations";
import { mprApi } from "../../mprApi";
import { TextField } from "@mui/material";

export const CardContact = () => {

    const [email, setEmail] = useState('');
    const { enqueueSnackbar } = useSnackbar();
    
    const handleClick = async () => {
        
        if ( !isValidEmail( email ) ) return enqueueSnackbar('El correo no es válido', { variant: 'error' });
        
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
        <p className={ styles.subtitle }>Mantente informado</p>

        <p>Mantente al día sobre nuestro proyecto!</p>

        <TextField placeholder="Escribe tu correo" variant="filled" color='secondary' fullWidth onChange={ ({ target }) => setEmail( target.value ) } />

        <button style={{ marginBottom: 0, marginTop: '.8rem' }} className='button button--full' onClick={ handleClick }>¡Suscríbete!</button>
    </div>
  )
}
