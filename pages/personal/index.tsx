import { NextPage, GetServerSideProps } from 'next';
import { nextAuthOptions } from '../api/auth/[...nextauth]';
import { unstable_getServerSession } from 'next-auth';
import { Box, Chip, Link, Typography } from '@mui/material';
import { Home } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { format as formatDate } from 'date-fns';

import { dbOrders, dbUsers } from '../../database';
import { MainLayout } from '../../components';
import { ConfirmNotificationButtons, format, PromiseConfirmHelper } from '../../utils';
import { IOrder, IUser } from '../../interfaces';
import { mprApi } from '../../mprApi';

interface Props {
  user: IUser;
  orders: IOrder[];
}

const PersonalPage: NextPage<Props> = ({ user, orders }) => {

  const { enqueueSnackbar } = useSnackbar();

  const unsubscribe = async () => {
    let key = enqueueSnackbar('¿Quieres dejar de recibir notificaciones en tu correo?', {
      variant: 'info',
      autoHideDuration: 10000,
      action: ConfirmNotificationButtons,
    })

    const confirm = await PromiseConfirmHelper( key, 10000 );

    if ( !confirm ) return;

    try {
      const { data } = await mprApi.post('/contact', { email: user.email, subscribe: 'false' });

      enqueueSnackbar(data.message, { variant: 'info' });
    } catch( error ) {
        // @ts-ignore
        enqueueSnackbar(error.response ? error.response.data.message || 'Ocurrió un error' : 'Ocurrió un error', { variant: 'error' });
    }
  }

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
        
        <Typography sx={{ my: 1.5 }}>Te uniste a la manada el { formatDate( new Date( user.createdAt ), 'dd/MM/yyyy' ) }</Typography>

        {
          ( user.isSubscribed )
            ? <Box>
                <Typography>¡Estás suscrit@ a <span style={{ textDecoration: 'underline', fontWeight: '600' }}>Mi Primer Rescate</span>! Recibirás información exclusiva de nuestra fundación en tu correo electrónico.</Typography>
                { user.isSubscribed && <Typography>¿Ya no quieres recibir información? Pulsa <span onClick={ unsubscribe } style={{ cursor: 'pointer', color: 'var(--secondary-color-2)' }}>aquí</span>.</Typography> }
              </Box>
            : <Typography>No estás suscrit@ a nuestra página :{'('}</Typography>
        }

        <Typography variant='subtitle1' sx={{ mt: 2.5, fontSize: '1.4rem' }}>Mis Órdenes</Typography>

        <Box display='flex' flexDirection='column' gap='1.5rem'>
          {
            ( orders.length === 0 )
              ? <Typography>Aún no has creado ninguna órden.</Typography>
              : orders.map(( order ) =>
                <Box key={ order._id } display='flex' flexDirection='column' gap='.8rem' sx={{ backgroundColor: '#fafafa', padding: '.8rem', boxShadow: '0 0 1.2rem -.8rem #555', borderRadius: '1.5rem' }}>
                  <Typography sx={{ fontSize: '1.1rem', fontWeight: '600' }}>ID de la Órden: { order._id }</Typography>
                  
                  <Typography sx={{ fontSize: '1.1rem', fontWeight: '600' }}>ID de la Transacción: { order.transaction.transactionId }</Typography>

                  <Typography>Esta órden fue creada el { formatDate( order.createdAt, 'dd/MM/yyyy hh:mm:ssaa' ).toLowerCase() }</Typography>

                  <div>
                    <Typography sx={{ fontSize: '1.2rem', fontWeight: '600', color: '#333' }}>Productos</Typography>
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

                  <Typography>Total: { format( order.transaction.totalUSD ) } = Bs. { order.transaction.totalBs }</Typography>
                  
                  <Box>
                      <Chip
                          color={ ( order.transaction.status === 'paid' || order.transaction.status === 'send' ) ? 'success' : 'warning' }
                          label={ ( order.transaction.status === 'paid' || order.transaction.status === 'send' ) ? 'Pagada' : 'No pagada' }
                          variant='filled'
                        />
                  </Box>

                  <Box display='flex' flexDirection='column'>
                    <Typography sx={{ fontSize: '1.2rem', fontWeight: '600', color: '#333' }}>Contacto</Typography>
                    <Box display='flex' flexDirection='column' gap='.3rem'>
                      <Typography>Nombre: { order.contact.name }</Typography>
                      { order.contact.facebook && <Typography>Facebook: { order.contact.facebook }</Typography> }
                      { order.contact.instagram && <Typography>Instagram: { order.contact.instagram }</Typography> }
                      { order.contact.whatsapp && <Typography>Whatsapp: { order.contact.whatsapp }</Typography> }
                    </Box>
                  </Box>

                  <Box display='flex' flexDirection='column'>
                    <Typography sx={{ fontSize: '1.2rem', fontWeight: '600', color: '#333' }}>Dirección</Typography>
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
  
  // const orders = await dbOrders.getUserOrders( session.user._id );

  return {
    props: {
      user: user,
      orders: user.orders,
    }
  }
}

export default PersonalPage;