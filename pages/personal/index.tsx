import { useContext, useState } from 'react';
import { NextPage, GetServerSideProps } from 'next';
import { nextAuthOptions } from '../api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth';
import { Box, Button, Chip, Link, Typography } from '@mui/material';
import { Home } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { format as formatDate } from 'date-fns';

import { dbUsers } from '../../database';
import { mprApi } from '../../mprApi';
import { ScrollContext } from '../../context';
import { MainLayout, UserPetInfo } from '../../components';
import { ConfirmNotificationButtons, format, PromiseConfirmHelper } from '../../utils';
import { IOrder, IPet, IUser } from '../../interfaces';

interface Props {
  user: IUser;
  orders: IOrder[];
  pets: IPet[];
}

const PersonalPage: NextPage<Props> = ({ user, orders, pets }) => {

  const { enqueueSnackbar } = useSnackbar();
  const [myPets, setMyPets] = useState<IPet[]>( pets );
  const [isSubscribed, setIsSubscribed] = useState( user.isSubscribed );
  const { setIsLoading } = useContext( ScrollContext );

  const updatePetInfo = ( petInfo: IPet ) =>
    setMyPets(( prevState ) => prevState.map(( pet ) => pet._id !== petInfo._id ? pet : petInfo));

  const unsubscribe = async () => {
    let key = enqueueSnackbar('¿Quieres dejar de recibir notificaciones en tu correo?', {
      variant: 'info',
      autoHideDuration: 10000,
      action: ConfirmNotificationButtons,
    });

    const confirm = await PromiseConfirmHelper( key, 10000 );

    if ( !confirm ) return;

    try {
      const { data } = await mprApi.post('/contact', { email: user.email, subscribe: 'false' });

      setIsLoading( true );
      enqueueSnackbar(data.message, { variant: 'info' });
      setIsLoading( false );

      !data.error && setIsSubscribed( false );
    } catch( error ) {
        // @ts-ignore
        enqueueSnackbar(error.response ? error.response.data.message || 'Ocurrió un error' : 'Ocurrió un error', { variant: 'error' });
    }
  }

  return (
    <MainLayout title='Información Personal' pageDescription='Información personal de tu usuario de MPR' titleIcon={ <Home color='info' sx={{ fontSize: '1.5rem' }} /> } nextPage='/' url='/personal'>
        
        <section className='content-island'>
          <Box display='flex' flexDirection='column' sx={{ mb: 1.5 }}>
            <Typography sx={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--secondary-color-1-complement)', }}>Nombre</Typography>
            <Typography>{ user.name }</Typography>
          </Box>
          
          <Box display='flex' flexDirection='column' sx={{ mb: 1.5 }}>
            <Typography sx={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--secondary-color-1-complement)', }}>Correo</Typography>
            <Typography>{ user.email }</Typography>
          </Box>

          <Typography sx={{ my: 1.5 }}>Te uniste a la manada el { formatDate( user.createdAt, 'dd/MM/yyyy' ) }</Typography>

          {
            ( isSubscribed )
              ? <Box className='fadeIn'>
                  <Typography>¡Estás suscrit@ a <span style={{ textDecoration: 'underline', fontWeight: '600' }}>Mi Primer Rescate</span>! Recibirás información exclusiva de nuestra fundación en tu correo electrónico.</Typography>
                  <Typography>¿Ya no quieres recibir información? Pulsa <Button className='button button--purple low--padding' onClick={ unsubscribe }>aquí</Button></Typography>
                </Box>
              : <Typography className='fadeIn'>No estás suscrit@ a nuestra página. ¡Suscríbete para recibir información personalizada y estar al tanto de nuestros eventos!</Typography>
          }
        </section>

        <Typography variant='subtitle1' sx={{ mt: 2.5, fontSize: '1.4rem' }}>Mis Mascotas</Typography>

        <Box display='flex' flexDirection='column' gap='1rem'>
          {
            ( myPets.length === 0 )
              ? <Typography>Aún no has subido ninguna mascota.</Typography>
              : myPets.map(( pet ) => (
                <UserPetInfo key={ pet._id } pet={ pet } updatePetInfo={ updatePetInfo } />
              ))
          }
        </Box>

        <Typography variant='subtitle1' sx={{ mt: 2.5, fontSize: '1.4rem' }}>Mis Órdenes</Typography>

        <Box display='flex' flexDirection='column' gap='1.5rem'>
          {
            ( orders.length === 0 )
              ? <section className='content-island'><Typography>Aún no has creado ninguna órden.</Typography></section>
              : orders.map(( order ) =>
                <Box key={ order._id } display='flex' flexDirection='column' gap='.8rem' sx={{ backgroundColor: '#fafafa', padding: '.8rem', boxShadow: '0 0 .8rem -.5rem #666', borderRadius: '1rem' }}>
                  <Box>
                    <Typography sx={{ color: 'var(--secondary-color-1-complement)', fontSize: '1.2rem', fontWeight: '600' }}>ID de la Órden</Typography>
                    <Typography>{ order._id }</Typography>
                  </Box>
                  
                  <Box>
                    <Typography sx={{ color: 'var(--secondary-color-1-complement)', fontSize: '1.2rem', fontWeight: '600' }}>ID de la Transacción</Typography>
                    <Typography>{ order.transaction.transactionId }</Typography>
                  </Box>

                  <Box>
                    <Typography sx={{ color: 'var(--secondary-color-1-complement)', fontSize: '1.2rem', fontWeight: '600' }}>Método</Typography>
                    <Typography>{ order.transaction.method }{ order.transaction.method === 'Pago móvil' ? `, ${ order.transaction.phone }` : '' }</Typography>
                  </Box>

                  <Typography>Esta órden fue creada el { formatDate( order.createdAt, 'dd/MM/yyyy hh:mm:ssaa' ).toLowerCase() }</Typography>

                  <div>
                    <Typography sx={{ color: 'var(--secondary-color-1-complement)', fontSize: '1.2rem', fontWeight: '600' }}>Productos</Typography>
                    <Box display='flex' flexDirection='column' gap='.3rem' sx={{ fontSize: '1.1rem' }}>
                      {
                          order.orderItems.map(( product ) => (
                            <Typography key={ product._id + product.size }>
                                { product.name }{ product.size !== 'unique' && ` (${ product.size })` }, { product.quantity } { product.quantity === 1 ? 'unidad' : 'unidades' } x { format( product.price * ( 1 - product.discount ) ) } = { format( product.price * ( 1 - product.discount ) * product.quantity ) }
                            </Typography>
                          ))
                      }
                    </Box>
                  </div>

                  <Box>
                    <Typography sx={{ color: 'var(--secondary-color-1-complement)', fontSize: '1.2rem', fontWeight: '600' }}>Total</Typography>
                    <Typography>{ format( order.transaction.totalUSD ) } = Bs. { order.transaction.totalBs }</Typography>
                  </Box>
                  
                  <Box>
                      <Chip
                          color={ ( order.transaction.status === 'paid' || order.transaction.status === 'send' ) ? 'success' : 'warning' }
                          label={ ( order.transaction.status === 'paid' || order.transaction.status === 'send' ) ? 'Pagada' : 'No pagada' }
                          variant='filled'
                        />
                  </Box>

                  <Box display='flex' flexDirection='column'>
                    <Typography sx={{ color: 'var(--secondary-color-1-complement)', fontSize: '1.2rem', fontWeight: '600' }}>Contacto</Typography>
                    <Box display='flex' flexDirection='column' gap='.3rem'>
                      <Typography>Nombre: { order.contact.name }</Typography>
                      { order.contact.facebook && <Typography>Facebook: { order.contact.facebook }</Typography> }
                      { order.contact.instagram && <Typography>Instagram: { order.contact.instagram }</Typography> }
                      { order.contact.whatsapp && <Typography>Whatsapp: { order.contact.whatsapp }</Typography> }
                    </Box>
                  </Box>

                  <Box display='flex' flexDirection='column'>
                    <Typography sx={{ color: 'var(--secondary-color-1-complement)', fontSize: '1.2rem', fontWeight: '600' }}>Dirección</Typography>
                    <Box display='flex' flexDirection='column' gap='.3rem'>
                        <Typography>{ order.shippingAddress.address }</Typography>
                        { order.shippingAddress.maps.latitude && order.shippingAddress.maps.longitude &&
                            <Link href={ `https://www.google.com/maps/@${ order.shippingAddress.maps.latitude },${ order.shippingAddress.maps.longitude },14z?hl=es` } target='_blank' rel='noreferrer' alignSelf='flex-start' sx={{ color: '#666', fontWeight: '600' }}>Ver en Maps</Link>
                        }
                      </Box>
                  </Box>
                </Box>
            )
          }
        </Box>

        
    </MainLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {

  const session: any = await unstable_getServerSession(req, res, nextAuthOptions);

  if ( !session ) return {
      redirect: {
        destination: '/auth?p=/personal',
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
  
  return {
    props: {
      user: user,
      orders: user.orders,
      // @ts-ignore
      pets: user.pets/*.filter(( p ) => !p.isAdminPet)*/,
    }
  }
}

export default PersonalPage;