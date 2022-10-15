import { useContext, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Box, Button, Card, CardContent, Divider, Grid, TextField, Typography } from '@mui/material';
import { AddShoppingCart, RemoveShoppingCart, ShoppingBag } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

import { AuthContext, CartContext, ScrollContext } from '../../context';
import { CartProductInfo, DirectionForm, ShopLayout } from '../../components';
import { ConfirmNotificationButtons, format } from '../../utils';
import { dbOrders } from '../../database';
import { IAddress, IContact } from '../../interfaces';

const CarritoPage: NextPage = () => {

  const router = useRouter();
  const { user } = useContext( AuthContext );
  const { cart, clearCart, numberOfItems } = useContext( CartContext );
  const { isLoading, setIsLoading } = useContext( ScrollContext );
  const { enqueueSnackbar } = useSnackbar();
  const [contact, setContact] = useState<IContact>({ name: '', facebook: '', instagram: '', whatsapp: '' });
  const [direction, setDirection] = useState<IAddress>({ address: '', maps: '' });

  const cleaningCart = () => {
    new Promise(( resolve ) => {
      let key = enqueueSnackbar('¿Quieres vaciar el carrito?', {
        variant: 'info',
        autoHideDuration: 15000,
        action: ConfirmNotificationButtons
      });

      const callback = ( e: any ) => {
        if ( e.target.matches(`.notification__buttons.accept.n${ key.toString().replace('.', '') } *`) )
          resolve({
            accepted: true,
            callback,
          })

        if ( e.target.matches(`.notification__buttons.deny.n${ key.toString().replace('.', '') }`) ) {
          resolve({
            accepted: false,
            callback,
          })
        }
      }

      document.addEventListener('click', callback);
      // @ts-ignore
    }).then(({ accepted, callback }: { accepted: boolean, callback: any }) => {
      document.removeEventListener('click', callback);
      accepted && clearCart();
    })
  }

  const handleCheckout = async () => {
    setIsLoading( true );
    
    if ( !user ) {
      router.push('/auth?p=/tienda/carrito');
      return;
    }

    if ( contact.name.length < 3 ) {
      setIsLoading( false );
      return enqueueSnackbar('Necesitamos el nombre del comprador', { variant: 'warning' });
    }

    if ( Object.values( direction ).filter(d => d).length < 2 ) {
      setIsLoading( false );
      return enqueueSnackbar('Necesitamos una dirección de entrega', { variant: 'warning' });
    }
    
    if ( Object.values( contact ).filter(c => c).length < 1 ) {
      setIsLoading( false );
      return enqueueSnackbar('Necesitamos al menos un método de contacto', { variant: 'warning' });
    }

    const total = cart.reduce(( prev, { quantity, price, discount } ) => prev + quantity * ( discount || price ), 0)

    const res = await dbOrders.createNewOrder( user._id, cart, total, direction, contact );

    if ( res.error ) {
      enqueueSnackbar(res.message, { variant: 'error' });
      setIsLoading( false );
      return;
    }

    enqueueSnackbar(res.message, { variant: 'success' });
    setIsLoading( false );
    return;
  }

  return (
    <ShopLayout title={ 'Carrito de compras' } H1={ 'Tienda' } pageDescription={ 'Carrito de compras, lista de productos' } nextPage={ '/tienda' } titleIcon={ <ShoppingBag color='info' sx={{ fontSize: '1.5rem' }} /> }>
        <Typography sx={{ fontSize: '1.4rem', fontWeight: '600', color: '#333', mb: 3 }}>Tu carrito <AddShoppingCart color='secondary' sx={{ transform: 'translateY(6px)' }} /></Typography>
        
        <Grid container display='flex' gap='.5rem'>  
          <Grid item display='flex' flexDirection='column' gap='1.5rem' flexGrow={ 1 }>
            {
              cart.map(( product, index ) => <CartProductInfo key={ product.name + index } product={ product } /> )
            }

            { ( numberOfItems > 0 )
                ? (
                    <Button
                      variant='outlined'
                      color='secondary'
                      sx={{ fontSize: '1rem' }}
                      onClick={ cleaningCart }>
                      Limpiar carrito
                    </Button>
                  )
                : <Typography>No tienes nada en el carrito <RemoveShoppingCart sx={{ transform: { xs: 'translateY(4px)', sm: 'translateY(6px)', md: 'translateY(8px)' } }} color='secondary' /></Typography>
            }
          </Grid>
            
          <Grid item flexGrow={ 1 }>
            <Card>
              <CardContent>
                <Typography sx={{ fontSize: '1.3rem', fontWeight: '700' }}>Productos</Typography>
                  {
                    ( cart.length > 0 )
                      ? cart.map(( p, index ) =>
                      <Box key={ p.name + index } display='flex' justifyContent='space-between'>
                        <Typography>
                          { p.name }{ p.size !== 'unique' ? ` (${ p.size })` : '' }
                        </Typography>
                        <Typography textAlign='end'>
                          { p.discount > 0 && p.discount < 0.5 ? format( p.price - p.discount * p.price ) : format(p.price) } x { p.quantity } = { format( (p.price - p.discount * p.price) * p.quantity ) }
                        </Typography>
                      </Box>
                      )
                      : <Typography>¡El carrito está vacío!</Typography>
                  }

                  <Divider sx={{ my: 1 }} />
                  
                  <Box display='flex' justifyContent='space-between' alignItems='center'>
                    <Typography sx={{ fontSize: '1.3rem', fontWeight: '700' }}>Total</Typography>
                    <Typography>
                      { ( cart.length > 0 )
                          ? format( cart.reduce(( prev, { quantity, price, discount } ) => prev + quantity * ( discount || price ), 0))
                          : format( 0 )
                      }
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Typography sx={{ fontSize: '1.3rem', fontWeight: '700' }}>Tu Dirección</Typography>

                  <Box sx={{ mb: 1 }}>
                    <TextField
                      name='address'
                      value={ direction.address }
                      label='Descripción corta'
                      type='text'
                      color='secondary'
                      variant='filled'
                      multiline
                      fullWidth
                      onChange={ ( e ) => setDirection({ ...direction, address: e.target.value }) }
                      />
                  </Box>

                  <Box sx={{ mb: 1 }}>
                    <TextField
                      name='maps'
                      value={ direction.maps }
                      label='Google Maps'
                      type='text'
                      color='secondary'
                      variant='filled'
                      fullWidth
                      onChange={ ( e ) => setDirection({ ...direction, maps: e.target.value }) }
                      />
                  </Box>
                  
                  <Divider sx={{ my: 1 }} />

                  <Typography sx={{ fontSize: '1.3rem', fontWeight: '700' }}>Contacto</Typography>

                  <Box sx={{ mb: 1 }}>
                    <TextField
                      name='name'
                      value={ contact.name }
                      label='Nombre de la persona'
                      type='text'
                      color='secondary'
                      variant='filled'
                      fullWidth
                      onChange={ ( e ) => setContact({ ...contact, name: e.target.value }) }
                      />
                  </Box>

                  <Typography sx={{ fontSize: '.9rem', color: '#666', mt: 3 }}>¡Necesario al menos uno!</Typography>

                  <Box sx={{ mb: 1 }}>
                    <TextField
                      name='facebook'
                      value={ contact.facebook }
                      label='Facebook'
                      type='text'
                      color='secondary'
                      variant='filled'
                      fullWidth
                      onChange={ ( e ) => setContact({ ...contact, facebook: e.target.value }) }
                      />
                  </Box>

                  <Box sx={{ mb: 1 }}>
                    <TextField
                      name='instagram'
                      value={ contact.instagram }
                      label='Instagram'
                      type='text'
                      color='secondary'
                      variant='filled'
                      fullWidth
                      onChange={ ( e ) => setContact({ ...contact, instagram: e.target.value }) }
                      />
                  </Box>

                  <Box sx={{ mb: 1 }}>
                    <TextField
                      name='whatsapp'
                      value={ contact.whatsapp }
                      label='Whatsapp'
                      type='text'
                      color='secondary'
                      variant='filled'
                      fullWidth
                      onChange={ ( e ) => setContact({ ...contact, whatsapp: e.target.value }) }
                    />
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  <Button
                      className='circular-btn'
                      color='secondary'
                      fullWidth
                      disabled={ cart.length < 1 || isLoading }
                      sx={{ fontSize: '1rem' }}
                      onClick={ handleCheckout }
                      >
                    Crear orden
                  </Button>
              </CardContent>
            </Card>
          </Grid>
          
        </Grid>
    </ShopLayout>
  )
}

export default CarritoPage;