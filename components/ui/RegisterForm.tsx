import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { Box, Button, Checkbox, Chip, TextField, Typography } from '@mui/material';
import { Check, ErrorOutline } from '@mui/icons-material';
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
    const [aSuccess, setASuccess] = useState('');

    const onRegisterForm = async ( { name, email, password }: FormData ) => {
        setASuccess('');
        setAnError({ error: false, message: '' });
        setIsLoading( true );
        
        const { error, message } = await registerUser( name, email, password, checked );
        
        setIsLoading( false );

        if ( error ) {
            setAnError({ error, message });
            setTimeout(() => setAnError({ error: false, message: '' }), 15000);
            return;
        }

        setASuccess( message );
        
        // Cookies.set('mpr__extendSession', 'true');
        // let destination = query.p?.toString() || '/';
        // await signIn('credentials', { email, password, callbackUrl: destination });
        // setIsLoading( false );
    }

  return (
    <form style={{ width: '100%', padding: 0 }} onSubmit={ handleSubmit(onRegisterForm) } noValidate>
            <Box display='flex' flexDirection='column' gap='.5rem'>

                    { anError.message &&
                        <Box>
                            <Chip
                                label={ anError.message || 'Ocurrió un error' }
                                color='error'
                                icon={ <ErrorOutline /> }
                                className='fadeIn'
                            />
                        </Box>
                    }

                    { aSuccess &&
                        <Box display='flex' gap='.5rem' sx={{ backgroundColor: 'rgb(7, 179, 7)', color: '#fafafa', borderRadius: '1rem', padding: '.5rem' }}>
                            <Check color='info' sx={{ alignSelf: 'center' }} />
                            <Typography color='success' className='fadeIn'>{ aSuccess }</Typography>
                        </Box>
                    }
                    
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
                                    minLength: { value: 8, message: 'La clave debe contener al menos 8 caracteres' },
                                    validate: ( val ) => new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!_@#\$%\^&\*])(?=.{8,})").test( val ) ? undefined : 'La clave debe contener minúsculas, mayúsculas y un caracter especial'
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
