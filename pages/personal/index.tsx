import { NextPage, GetServerSideProps } from 'next';
import { nextAuthOptions } from '../api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth';
import { Box, Button, Typography } from '@mui/material';
import { Home } from '@mui/icons-material';
import Cookies from 'js-cookie';

import { dbOrders, dbUsers } from '../../database';
import { MainLayout } from '../../components';
import { IAddress, IUser } from '../../interfaces';
import { useEffect } from 'react';

interface Props {
  user: IUser;
}

const PersonalPage: NextPage<Props> = ({ user }) => {

  // const [contact, setContact]

  // useEffect(() => {
  //   const : IAddress = JSON.parse( Cookies.get('mpr__contact') || "{ address: '', maps: '' }" );
  // }, [])

  return (
    <MainLayout title='Información Personal' pageDescription='Información personal de tu usuario de MPR' titleIcon={ <Home color='info' sx={{ fontSize: '1.5rem' }} /> } nextPage={ '/' }>
        
        <Box display='flex' alignItems='flex-end' gap='.5rem' sx={{ mb: 1.5 }}>
          <Typography sx={{ fontSize: '1.2rem', fontWeight: '600' }}>Nombre:</Typography>
          <Typography>{ user.name }</Typography>
        </Box>
        
        <Box display='flex' alignItems='flex-end' gap='.5rem' sx={{ mb: 1.5 }}>
          <Typography sx={{ fontSize: '1.2rem', fontWeight: '600' }}>Correo:</Typography>
          <Typography>{ user.email }</Typography>
        </Box>
        
        <Typography sx={{ my: 1.5 }}>Te uniste a la manada el { new Date( user.createdAt ).toLocaleDateString() }</Typography>

        {
          ( !user.isSubscribed )
            ? <Typography>¡Estás subscrit@ a <span style={{ textDecoration: 'underline', fontWeight: '600' }}>Mi Primer Rescate</span>!</Typography>
            : <Typography>No estás subscrito a nuestra página :(</Typography>
        }

        <Typography variant='subtitle1' sx={{ mt: 2.5, fontSize: '1.4rem' }}>Tu Información de Contacto</Typography>

        {
          <>
            <Typography>Vaya, parece que no tienes ninguna información de contacto guardada, ¿quieres guardar una para agilizar futuras compras?</Typography>
            <Button color='secondary'>Contacto</Button>
          </>
        }

        <Typography variant='subtitle1' sx={{ mt: 2.5, fontSize: '1.4rem' }}>Mis Órdenes</Typography>

        
    </MainLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {

  const session: any = await unstable_getServerSession(req, res, nextAuthOptions);

  if ( !session ) return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }

  const user = await dbUsers.getUserById( session.user._id );

  if ( !user ) return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }

  // const orders = await dbOrders.getUserOrders( session.user._id );

  return {
    props: {
      user,
      // orders,
    }
  }
}

export default PersonalPage;