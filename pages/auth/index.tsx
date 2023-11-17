import { useContext, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import { Box, Button, Card, Chip, CircularProgress, TextField, Typography } from '@mui/material';
import Check from '@mui/icons-material/Check';
import ErrorOutline from '@mui/icons-material/ErrorOutline';
import Home from '@mui/icons-material/Home';
import Facebook from '@mui/icons-material/Facebook';
import Instagram from '@mui/icons-material/Instagram';
import Google from '@mui/icons-material/Google';


import { dbUsers } from '../../database';
import { ScrollContext } from '../../context';
import { MainLayout, ModalWindow, MyImage, LoginForm, RegisterForm, Loader } from '../../components';
import { validations } from '../../utils';
import styles from '../../components/ui/Form.module.css';

interface ProviderIcons {
  Facebook: JSX.Element;
  Instagram: JSX.Element;
  Google: JSX.Element;
}

const providerIcons: ProviderIcons = {
  Facebook: <Facebook color='info' />,
  Instagram: <Instagram color='info' />,
  Google: <Google color='info' />,
}

const AuthPage: NextPage = () => {

  const { push } = useRouter();
  const { data, status } = useSession();
  const { setIsLoading } = useContext(ScrollContext);
  const [correo, setCorreo] = useState('');
  const [anError, setAnError] = useState({ error: false, message: '' });
  const [aSuccess, setASuccess] = useState('');


  useEffect(() => {
    if (status === 'authenticated') push('/');
  }, [status, push])


  const handleChangePassword = async () => {
    if (!validations.isValidEmail(correo)) return setAnError({ error: true, message: 'El correo no es válido' });
    setAnError({ error: false, message: '' });

    setIsLoading(true);
    const res = await dbUsers.sendMailPassword(correo);

    if (res.error) {
      setAnError(res);
      setIsLoading(false);
      setTimeout(() => setAnError({ error: false, message: '' }), 15000);
      return;
    }

    setIsLoading(false);
    setASuccess(res.message);
  }

  return (
    <MainLayout title='Iniciar sesión' H1='Inicio' pageDescription='Inicia sesión con tu cuenta de MPR o regístrate y ten acceso a poder adoptar o comprar artículos para tu mascota.' pageImage={'Logo-MPR.png'} titleIcon={<Home color='info' sx={{ fontSize: '1.5rem' }} />} nextPage='/' url='/auth'>
      <Card sx={{ display: 'grid', padding: '1rem', border: { xs: 'none', sm: 'none', md: '2px solid var(--secondary-color-1)' }, gridTemplateColumns: { xs: '1fr', sm: '1fr', md: '1fr 1fr' }, alignItems: 'center' }}>

        <Box sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
          <MyImage src='/Logo-MPR.png' alt='Mi Primer Rescate' width={500} height={500} />
        </Box>

        {
          (status === 'loading' || status === 'authenticated')
            ? <Box sx={{ display: 'grid', placeItems: 'center' }}><CircularProgress color='secondary' /></Box>
            : (
              <Box display='flex' flexDirection='column' gap='.5rem'>
                <Box display='flex' flexDirection='column' gap='.3rem'>
                  <ModalWindow title='Sesión' buttonTxt='Iniciar sesión' buttonClassName='buttonOutlined'>
                    <LoginForm />
                  </ModalWindow>

                  <ModalWindow title='Recuperar contraseña' buttonTxt='¿Olvidaste tu contraseña?' buttonStyle={{ alignSelf: 'flex-end', padding: '0', margin: '.1rem 0 .4rem', fontSize: '.9rem', color: 'var(--secondary-color-1)', backgroundColor: '#fff', fontWeight: '400', }}>
                    <Box display='flex' flexDirection='column' gap='.5rem'>
                      <p style={{ margin: 0 }}>Enviaremos un mail a tu correo electrónico con un código de recuperación.</p>

                      {anError.message &&
                        <Box>
                          <Chip
                            label={anError.message}
                            color='error'
                            icon={<ErrorOutline />}
                            className='fadeIn'
                          />
                        </Box>
                      }

                      {aSuccess &&
                        <Box display='flex' gap='.5rem' sx={{ maxWidth: 'max-content', backgroundColor: 'rgb(7, 179, 7)', color: '#fafafa', borderRadius: '1rem', padding: '.5rem .8rem .5rem .5rem' }}>
                          <Check color='info' sx={{ alignSelf: 'center' }} />
                          <Typography color='success' className='fadeIn'>{aSuccess}</Typography>
                        </Box>
                      }

                      <TextField
                        type='email'
                        label='Correo'
                        value={correo}
                        variant='filled'
                        color='secondary'
                        fullWidth
                        onChange={({ target }) => setCorreo(target.value)}
                      />
                      <Button color='secondary' sx={{ fontSize: '.9rem', alignSelf: 'center', borderRadius: '5rem', padding: '.3rem 1.5rem' }} onClick={handleChangePassword}>Enviar correo</Button>
                    </Box>
                  </ModalWindow>
                </Box>

                <ModalWindow title='Crear cuenta' buttonTxt='Crear cuenta' buttonClassName='buttonOutlined'>
                  <RegisterForm />
                </ModalWindow>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '.6rem', mt: 1 }}>
                  <Typography textAlign='center'>¡Puedes iniciar sesión con alguna de tus redes!</Typography>

                  {
                    [{ id: 'google', name: 'Google' }, /*{ id: 'facebook', name: 'Facebook' },  { id: 'instagram', name: 'Instagram' }*/].map((provider: any) => {
                      return <Button
                        key={provider.id}
                        className={`${styles.share__button} ${provider.name === 'Facebook' ? styles.facebook : provider.name === 'Instagram' ? styles.instagram : styles.google}`}
                        onClick={() => provider.name === 'Google' && signIn(provider.id)}
                      >
                        {providerIcons[provider.name as keyof ProviderIcons]}{provider.name}
                      </Button>
                    })
                  }
                </Box>
              </Box>
            )
        }

      </Card>
    </MainLayout>
  )
}

export default AuthPage;
