import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, Checkbox, Chip, TextField, Typography } from '@mui/material';
import { Check, ErrorOutline } from '@mui/icons-material';

import { AuthContext, ScrollContext } from '../../context';
import { validations } from '../../utils';


type FormData = {
    name     : string;
    email    : string;
    password : string;
    password2: string;
}


export const RegisterForm = () => {

    const { registerUser } = useContext( AuthContext );
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const { isLoading, setIsLoading } = useContext( ScrollContext );
    const [checked, setChecked] = useState(false);
    const [aResponse, setAResponse] = useState({ error: false, message: '' });
    const [displayInfo, setDisplayInfo] = useState( false );

    const onRegisterForm = async ( { name, email, password, password2 }: FormData ) => {
        setAResponse({ error: false, message: '' });

        if ( password !== password2 ) {
            setAResponse({ error: true, message: 'Las contraseñas deben ser iguales' });
            setTimeout(() => setAResponse({ error: false, message: ''}), 10000);
            return;
        }

        setIsLoading( true );
        
        const res = await registerUser( name, email, password, checked );
        
        setIsLoading( false );

        setAResponse( res );

        if ( res.error ) return setTimeout(() => setAResponse({ error: false, message: '' }), 12000);
    }

  return (
    <form style={{ width: '100%', padding: 0 }} onSubmit={ handleSubmit(onRegisterForm) } noValidate>
            <Box display='flex' flexDirection='column' gap='.5rem'>

                    { aResponse.error &&
                        <Box>
                            <Chip
                                label={ aResponse.message || 'Ocurrió un error' }
                                color='error'
                                icon={ <ErrorOutline /> }
                                className='fadeIn'
                            />
                        </Box>
                    }

                    { !aResponse.error && aResponse.message &&
                        <Box display='flex' gap='.5rem' sx={{ backgroundColor: 'rgb(7, 179, 7)', color: '#fafafa', borderRadius: '1rem', padding: '.5rem' }}>
                            <Check color='info' sx={{ alignSelf: 'center' }} />
                            <Typography color='success' className='fadeIn'>{ aResponse.message }</Typography>
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
                                    validate: validations.isPassword
                                })
                            }
                            error={ !!errors.password }
                            helperText={ errors.password?.message }
                        />
                    </Box>

                    <Box>
                        <TextField
                            label='Contraseña 2'
                            type='password'
                            variant='filled'
                            color='secondary'
                            fullWidth
                            {
                                ...register('password2', {
                                    required: 'Este campo es requerido',
                                    minLength: { value: 8, message: 'La clave debe contener al menos 8 caracteres' },
                                    validate: validations.isPassword
                                })
                            }
                            error={ !!errors.password2 }
                            helperText={ errors.password2?.message }
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
