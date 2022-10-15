import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { Box, Button, Checkbox, Chip, Grid, Input, TextField, Typography } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import Cookies from 'js-cookie';

import { AuthContext, ScrollContext } from '../../context';
import { validations } from '../../utils';


type FormData = {
    name    : string;
    email   : string;
    password: string;
}


export const RegisterForm = () => {

    const { query } = useRouter();
    const { registerUser } = useContext( AuthContext );
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const { isLoading, setIsLoading } = useContext( ScrollContext );
    const [checked, setChecked] = useState(false);
    const [anError, setAnError] = useState({ error: false, message: '' });

    const onRegisterForm = async ( { name, email, password }: FormData ) => {
        setIsLoading( true );
        
        const { error, message } = await registerUser( name, email, password, checked );
        
        if ( error ) {
            setIsLoading( false );
            setAnError({ error, message });
            setTimeout(() => setAnError({ error: false, message: '' }), 5000);
            return;
        }
        
        Cookies.set('mpr__extendSession', 'true');
        let destination = query.p?.toString() || '/';
        await signIn('credentials', { email, password, callbackUrl: destination });
        setIsLoading( false );
    }

  return (
    <form style={{ width: '100%', padding: 0 }} onSubmit={ handleSubmit(onRegisterForm) } noValidate>
            <Box display='flex' flexDirection='column' gap='.5rem'>

                    <Box sx={{ display: anError.error ? 'block' : 'none' }}>
                        <Chip
                            label={ anError.message || 'Ocurrió un error' }
                            color='error'
                            icon={ <ErrorOutline /> }
                            className='fadeIn'
                        />
                    </Box>
                    
                    <Box>
                        <TextField
                            label='Nombre Completo'
                            variant='filled'
                            fullWidth
                            color='secondary'
                            {
                                ...register('name', {
                                    required: 'Este campo es requerido',
                                    minLength: { value: 2, message: 'El nombre debe tener al menos 2 caracteres' }
                                })
                            }
                            error={ !!errors.name }
                            helperText={ errors.name?.message }
                        />
                    </Box>

                    <Box>
                        <TextField
                            type='email'
                            label='Correo'
                            variant='filled'
                            color='secondary'
                            fullWidth
                            {
                                ...register('email', {
                                    required: 'El correo no tiene un formato apropiado',
                                    validate: validations.isEmail
                                })
                            }
                            error={ !!errors.email }
                            helperText={ errors.email?.message }
                        />
                    </Box>

                    <Box>
                        <TextField
                            label='Contraseña'
                            type='password'
                            variant='filled'
                            color='secondary'
                            fullWidth
                            {
                                ...register('password', {
                                    required: 'Este campo es requerido',
                                    minLength: { value: 4, message: 'La contraseña debe contener al menos 4 caracteres'}
                                })
                            }
                            error={ !!errors.password }
                            helperText={ errors.password?.message }
                        />
                    </Box>

                    <Box display='flex' alignItems='center'>
                        <Checkbox
                            color='secondary'
                            checked={ checked }
                            onChange={ ({ target }) => setChecked( target.checked ) }
                        />
                        <Typography sx={{ cursor: 'pointer' }} onClick={ () => setChecked( !checked ) }>¿Te gustaría recibir las novedades de MPR?</Typography>
                    </Box>
                    
                    <Box>
                        <Button
                            type='submit'
                            color='secondary'
                            fullWidth
                            disabled={ isLoading }
                            sx={{ borderRadius: '10rem', fontSize: '.9rem', padding: '.4rem' }}
                        >
                            Crear Cuenta
                        </Button>
                    </Box>
                    
            </Box>
        </form>
  )
}
