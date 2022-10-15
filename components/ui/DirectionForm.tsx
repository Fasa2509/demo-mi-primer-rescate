import { useState } from 'react';
import { TextField, Typography } from '@mui/material';
import Cookies from 'js-cookie';

const formInitialState = { direction: '', maps: '' };

export const DirectionForm = () => {

    const [form, setForm] = useState( formInitialState );
    
    const handleSubmit = ( e: any ) => {
        e.preventDefault();


    }

  return (
    <form style={{ padding: 0 }} onSubmit={ handleSubmit }>
        <Typography sx={{ fontSize: '1.3rem', fontWeight: '700' }}>Dirección</Typography>

        <TextField
            label='Direccón de Entrega'
            variant='filled'
            type='text'
            multiline
            fullWidth
            color='secondary'
        />
    </form>
  )
}
