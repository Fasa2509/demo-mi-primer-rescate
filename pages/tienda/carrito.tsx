import { useContext, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Box, Button, Card, CardContent, Checkbox, Divider, TextField, Typography } from '@mui/material';
import { AddShoppingCart, Check, RemoveShoppingCart, ShoppingBag } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

import { mprRevalidatePage } from '../../mprApi';
import { dbOrders } from '../../database';
import { AuthContext, CartContext, ScrollContext } from '../../context';
import { CartProductInfo, ShopLayout } from '../../components';
import { ConfirmNotificationButtons, format, PromiseConfirmHelper } from '../../utils';
import { IAddress, IContact } from '../../interfaces';

const CarritoPage: NextPage = () => {

  const router = useRouter();
  const { user } = useContext( AuthContext );
  const { cart, clearCart, numberOfItems } = useContext( CartContext );
  const { isLoading, setIsLoading } = useContext( ScrollContext );
  const { enqueueSnackbar } = useSnackbar();
  const [contact, setContact] = useState<IContact>({ name: '', facebook: '', instagram: '', whatsapp: '' });
  const [direction, setDirection] = useState<IAddress>({ address: '', maps: { latitude: null, longitude: null } });
  const [directionError, setDirectionError] = useState('');
  const [checkboxInfo, setCheckboxInfo] = useState( false );

  useEffect(() => {
    let shopInfo = JSON.parse( window.localStorage.getItem('mpr__shopInfo') || '{ "any": "" }' );
    if ( shopInfo === undefined || shopInfo === null || shopInfo.any === '' || Object.values( shopInfo.contact ).filter(c => c).length < 2 || Object.values( shopInfo.direction.maps ).filter(d => d).length < 2 ) return;

    setContact( shopInfo.contact );
    setDirection( shopInfo.direction );
  }, [])

  const cleaningCart = async () => {
      let key = enqueueSnackbar('¿Quieres vaciar el carrito?', {
        variant: 'info',
        autoHideDuration: 15000,
        action: ConfirmNotificationButtons
      });

      const confirm = await PromiseConfirmHelper( key, 15000 );

      confirm && clearCart();
      return;
  }

  const handleCheckout = async () => {
    if ( !user ) {
      router.push('/auth?p=/tienda/carrito');
      return;
    }

    if ( direction.address.length < 5 ) {
      return enqueueSnackbar('Necesitamos una dirección de entrega', { variant: 'warning' });
    }

    if ( Object.values( direction.maps ).filter(m => m).length !== 2 ) {
      return enqueueSnackbar('Necesitamos la ubicación por Maps', { variant: 'warning' });
    }

    if ( contact.name.length < 2 ) {
      return enqueueSnackbar('Necesitamos el nombre del comprador', { variant: 'warning' });
    }
    
    if ( Object.values( contact ).filter(c => c).length < 1 ) {
      return enqueueSnackbar('Necesitamos al menos un método de contacto', { variant: 'warning' });
    }

    setIsLoading( true );
    
    const total = cart.reduce(( prev, { quantity, price, discount } ) => prev + quantity * ( discount || price ), 0)

    const res = await dbOrders.createNewOrder( user._id, cart, total, direction, contact );

    if ( res.error ) {
      enqueueSnackbar(res.message, { variant: 'error' });
      setIsLoading( false );
      return;
    }

    if ( checkboxInfo ) window.localStorage.setItem('mpr__shopInfo', JSON.stringify({ direction, contact }));
    
    enqueueSnackbar(res.message, { variant: 'success' });
    setIsLoading( false );
    return;
  }

  const handleLocation = () => {

    setIsLoading( true );
    
    setDirection(({ ...direction, maps: { latitude: null, longitude: null } }));
    
    const success: PositionCallback = function( position ) {
      setIsLoading( false );
      setDirectionError('');

      const { latitude, longitude, accuracy } = position.coords;

      if ( accuracy > 55 ) {
        setDirectionError('La precisión fue baja. Por favor inténtalo de nuevo');
        setTimeout(() => setDirectionError(''), 15000);
        return;
      }
      
      setDirection({
        ...direction,
        maps: {
          latitude,
          longitude,
        }
      })
    }
    
    const error: PositionErrorCallback = function(err) {
      setIsLoading( false );
      console.log(err);
      setDirectionError('Ocurrió un error con tu ubicación. Por favor vuelve a intentarlo.');
      setTimeout(() => setDirectionError(''), 15000);
    }
    
    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    }

    navigator.geolocation.getCurrentPosition(success, error, options);

  }
  
  const revalidate = async () => {
    if ( process.env.NODE_ENV !== 'production' ) return;

    const resRev = await mprRevalidatePage('/tienda/categoria');

    enqueueSnackbar(resRev.message, { variant: !resRev.error ? 'success' : 'error' });
  }


  return (
    <ShopLayout title={ 'Carrito de compras' } H1={ 'Tienda' } pageDescription={ 'Carrito de compras, lista de productos' } nextPage={ '/tienda' } titleIcon={ <ShoppingBag color='info' sx={{ fontSize: '1.5rem' }} /> }>
        <Typography sx={{ fontSize: '1.4rem', fontWeight: '600', color: '#333', mb: 3 }}>Tu carrito <AddShoppingCart color='secondary' sx={{ transform: 'translateY(6px)' }} /></Typography>
        
        <Box display='flex' gap='.5rem' flexWrap='wrap'>  
          <Box display='flex' flexDirection='column' gap='1.5rem' alignItems='center' flexGrow={ 1 }>
            {
              cart.map(( product, index ) => <CartProductInfo key={ product.name + index } product={ product } /> )
            }

            { ( numberOfItems > 0 )
                ? (
                    <Button
                      variant='outlined'
                      color='secondary'
                      sx={{ fontSize: '1rem', alignSelf: 'stretch' }}
                      onClick={ cleaningCart }>
                      Vaciar carrito
                    </Button>
                  )
                : <Typography>No tienes nada en el carrito <RemoveShoppingCart sx={{ transform: { xs: 'translateY(4px)', sm: 'translateY(6px)', md: 'translateY(8px)' } }} color='secondary' /></Typography>
            }
          </Box>
            
          <Box flexGrow={ 1 }>
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
                      label='Descripción de tu ubicación'
                      type='text'
                      color='secondary'
                      variant='filled'
                      multiline
                      fullWidth
                      onChange={ ( e ) => setDirection({ ...direction, address: e.target.value }) }
                      />
                  </Box>

                  <Box sx={{ mb: 1 }} display='flex' flexDirection='column'>
                      <Button color='secondary' disabled={ isLoading } sx={{ py: 1, fontSize: '1rem' }} onClick={ handleLocation }>Obtener ubicación en Maps</Button>
                      { Object.values( direction.maps ).filter(m => m).length === 2 &&
                        <Box display='flex' gap='.5rem' className='fadeIn' sx={{ maxWidth: 'max(250px, 20rem)', borderRadius: '10rem', mt: 1, padding: '.4rem 1rem .4rem .5rem', fontWeight: '600', backgroundColor: 'var(--success-color)' }}>
                          <Check color='info' />
                          <Typography sx={{ color: '#fafafa' }}>Tu ubicación es válida</Typography>
                        </Box>
                      }
                      { directionError.length > 0 &&
                        <Box display='flex' gap='.5rem' className='fadeIn' sx={{ maxWidth: 'max(250px, 22rem)', borderRadius: '10rem', mt: 1, padding: '.4rem 1rem', fontWeight: '600', fontSize: '.9rem', backgroundColor: 'var(--error-color)' }}>
                          <Typography sx={{ color: '#fafafa' }}>{ directionError }</Typography>
                        </Box>
                      }
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

                  <Box display='flex' alignItems='center'>
                    <Checkbox
                      color='secondary'
                      checked={ checkboxInfo }
                      onChange={ ({ target }) => setCheckboxInfo( target.checked ) }
                    />
                    <Typography sx={{ cursor: 'pointer', flexGrow: 1 }} onClick={ () => setCheckboxInfo( !checkboxInfo ) }>Guardar información</Typography>
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  <Button
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
          </Box>
          
        </Box>
        <Button variant='contained' color='secondary' onClick={ revalidate }>Revalidar esta página</Button>
    </ShopLayout>
  )
}

export default CarritoPage;