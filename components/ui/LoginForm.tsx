import { useContext, useState } from "react";
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { Box, Button, CardContent, Chip, TextField, Typography } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ErrorOutline from "@mui/icons-material/ErrorOutline";
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';

import { AuthContext, ScrollContext } from "../../context";
import { validations } from "../../utils";

type FormData = {
    email   : string;
    password: string;
}

export const LoginForm = () => {
  
    const { query } = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const { loginUser } = useContext( AuthContext );
    const { isLoading, setIsLoading } = useContext( ScrollContext );
    const [anError, setAnError] = useState({ error: false, message: '' });

    const onLoginForm = async ( { email, password }: FormData ) => {
      setAnError({ error: false, message: '' });
      setIsLoading( true );
      
      const { error, message } = await loginUser( email, password );

      if ( error ) {
        setIsLoading( false );
        setAnError({ error, message });
        setTimeout(() => setAnError({ error: false, message: '' }), 12000);
        return;
      }
      
      Cookies.set('mpr__extendSession', 'true');
      let destination = !query.p ? '/' : query.p.toString().match(/auth/i) ? '/' : query.p.toString();
      await signIn('credentials', { email, password, callbackUrl: destination });
      setIsLoading( false );
  }

  return (
          <form style={{ width: '100%', padding: 0 }} onSubmit={ handleSubmit(onLoginForm) }>
            <CardContent sx={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
              <Box display='flex' justifyContent='center' alignItems='center' gap='.5rem' sx={{ mb: 1 }}>
                <AccountCircle color='secondary' sx={{ fontSize: '2rem' }} />
                <Typography sx={{ fontSize: '1.4rem', fontWeight: 'bold' }} variant='h2'>Iniciar sesión</Typography>
              </Box>

              { anError.message &&
                <Box sx={{ mb: 1 }}>
                    <Chip
                        label={ anError.message || 'Ocurrió un error' }
                        color='error'
                        icon={ <ErrorOutline /> }
                        className='fadeIn'
                    />
                </Box>
              }

              <Box display='flex' flexDirection='column' gap='.5rem'>
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

                <TextField
                  label='Contraseña'
                  type='password'
                  variant='filled'
                  color='secondary'
                  fullWidth
                  {
                      ...register('password', {
                          required: 'Este campo es requerido',
                          minLength: { value: 4, message: 'La clave debe contener al menos 8 caracteres' },
                          validate: validations.isPassword
                      })
                  }
                  error={ !!errors.password }
                  helperText={ errors.password?.message }
                />

                <Button
                    type='submit'
                    color='secondary'
                    disabled={ isLoading }
                    className='buttonOutlined'
                >
                    Ingresar
                </Button>
              </Box>
            </CardContent>
          </form>
  )
}
