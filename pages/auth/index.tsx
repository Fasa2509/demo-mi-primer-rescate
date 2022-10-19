import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';
import { getProviders, signIn, useSession } from 'next-auth/react';
import { Box, Button, Card, Typography } from '@mui/material';
import { Home } from '@mui/icons-material';

import { MainLayout, ModalWindow, LoginForm, RegisterForm } from '../../components';

const AuthPage: NextPage = () => {

    // const [providers, setProviders] = useState<any>({});

    // useEffect(() => {
    //   getProviders()
    //       .then(prov => {
    //           setProviders(prov)
    //       })
    // }, [])

    return (
      <MainLayout title='Iniciar sesión' H1='Inicio' pageDescription='Inicia sesión con tu cuenta de MPR o regístrate y ten acceso a poder adoptar o comprar artículos para tu mascota.' pageImage={ 'Logo-MPR.png' } titleIcon={ <Home color='info' sx={{ fontSize: '1.5rem' }} /> } nextPage='/'>
        <Card sx={{ display: 'grid', padding: '1rem', border: { xs: 'none', sm: 'none', md: '2px solid var(--secondary-color-1)' }, gridTemplateColumns: { xs: '1fr', sm: '1fr', md: '1fr 1fr' }, alignItems: 'center' }}>
          
          <Box sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
            <Image src='/Logo-MPR.png' alt='Mi Primer Rescate' width={ 500 } height={ 500 } />
          </Box>

          <Box display='flex' flexDirection='column' gap='1rem'>
            <ModalWindow title='Sesión' buttonTxt='Iniciar sesión' buttonClassName='buttonOutlined'>
              <LoginForm />
            </ModalWindow>

            <ModalWindow title='Crear cuenta' buttonTxt='Crear cuenta' buttonClassName='buttonOutlined'>
              <RegisterForm />
            </ModalWindow>

            <Box display='flex' flexDirection='column' gap='.5rem'>
              <Typography>¡También puedes iniciar sesión con alguna de tus redes!</Typography>

              {/* {
                Object.values( providers ).map(( provider: any ) => {
                  if ( provider.id === "credentials" ) return <div style={{ display: 'none' }} key='credentials'></div>
                
                  return <Button
                      key={ provider.id}
                      variant='outlined'
                      fullWidth
                      color='secondary'
                      onClick={ () => signIn( provider.id ) }
                  >
                      { provider.name }
                  </Button>
                })
              } */}
            </Box>
          </Box>
          
        </Card>
      </MainLayout>
    )
}

export default AuthPage;
