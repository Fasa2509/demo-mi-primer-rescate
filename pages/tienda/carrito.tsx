import { useContext, useEffect } from 'react';
import { NextPage } from 'next';
import { Box, Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import { AddShoppingCart, RemoveShoppingCart, ShoppingBag } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

import { CartContext } from '../../context';
import { CartProductInfo, ShopLayout } from '../../components';
import { ConfirmNotificationButtons, format } from '../../utils';

const CarritoPage: NextPage = () => {

  const { cart, clearCart, numberOfItems, shippingAddress } = useContext( CartContext );
  const { enqueueSnackbar } = useSnackbar();

  const cleaningCart = () => {
    new Promise(( resolve, reject ) => {
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
    }).then(({ accepted, callback }) => {
      document.removeEventListener('click', callback);

      accepted && clearCart();
    })
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
                ? <Button variant='outlined' color='secondary' onClick={ cleaningCart }>
                    Limpiar carrito
                  </Button>
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
                          { p.name }
                        </Typography>
                        <Typography>
                          { p.discount ? format(p.discount) : format(p.price) } x { p.quantity } = { format(( p.discount || p.price ) * p.quantity) }
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

                  <Typography sx={{ fontSize: '1.3rem', fontWeight: '700' }}>Direccion</Typography>

                  <Typography>Tu dirección aquí</Typography>

                  <Divider sx={{ my: 1 }} />

                  <Button
                      className='circular-btn'
                      color='secondary'
                      fullWidth
                      disabled={ cart.length <= 0 }
                      onClick={ () => enqueueSnackbar('¡La orden fue creada!', { variant: 'success' }) }
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