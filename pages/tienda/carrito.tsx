import { useContext, useEffect, useState } from 'react';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { Box, Button, Card, CardContent, Checkbox, Divider, TextField, Typography } from '@mui/material';
import { AddShoppingCart, Check, RemoveShoppingCart, ShoppingBag } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

import { mprRevalidatePage } from '../../mprApi';
import { dbOrders, dbProducts } from '../../database';
import { AuthContext, CartContext, ScrollContext } from '../../context';
import { CartProductInfo, ShopLayout } from '../../components';
import { ConfirmNotificationButtons, format, PromiseConfirmHelper } from '../../utils';
import { IAddress, IProduct } from '../../interfaces';
import haversine from 'haversine-distance';

interface Props {
  // allProducts: IProduct[];
  dolarPrice: number;
}

const CarritoPage: NextPage<Props> = ({ /*allProducts, */dolarPrice }) => {

  const router = useRouter();
  const { user } = useContext( AuthContext );
  const { cart, clearCart, getTotal, numberOfItems/*, updateProductsInCart*/ } = useContext( CartContext );
  const { isLoading, setIsLoading } = useContext( ScrollContext );
  const { enqueueSnackbar } = useSnackbar();
  const [contact, setContact] = useState({ name: '', facebook: '', instagram: '', whatsapp: '' });
  const [direction, setDirection] = useState<IAddress>({ address: '', maps: { latitude: null, longitude: null } });
  const [directionError, setDirectionError] = useState('');
  const [checkboxInfo, setCheckboxInfo] = useState( false );
  const [existencyChecked, setExistencyChecked] = useState( false );
  const [transaction, setTransaction] = useState({ transactionId: '', method: '', phone: '' });

  // useEffect(() => {
  //   updateProductsInCart( allProducts );
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    let shopInfo = JSON.parse( window.localStorage.getItem('mpr__shopInfo') || '{ "any": "" }' );
    if ( shopInfo === undefined || shopInfo === null || shopInfo.any === '' || Object.values( shopInfo.contact ).filter(c => c).length < 2 || Object.values( shopInfo.direction.maps ).filter(d => d).length < 2 ) return;

    setContact( shopInfo.contact );
    setDirection( shopInfo.direction );
  }, []);

  useEffect(() => setExistencyChecked( false ), [cart]);

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

  const handleCheckout = async (transactionInfo: { method: string; transactionId: string; phone: string; }) => {
    if ( !user || !user._id ) {
      router.push('/auth?p=/tienda/carrito');
      return;
    }

    if ( transactionInfo.method === 'Pago móvil' ) {
    if ( direction.address.trim().length < 5 )
      return enqueueSnackbar('Necesitamos una dirección de entrega completa', { variant: 'warning' });

    if ( Object.values( direction.maps ).filter(m => m).length !== 2 )
      return enqueueSnackbar('Necesitamos la ubicación por Maps', { variant: 'warning' });

    if ( contact.name.trim().length < 2 )
      return enqueueSnackbar('Necesitamos el nombre del comprador', { variant: 'warning' });
    
    if ( Object.values( contact ).filter(c => c.trim()).length < 2 )
      return enqueueSnackbar('Necesitamos al menos un método de contacto', { variant: 'warning' });
    }

    const validMethod = ['Pago móvil', 'Paypal'];

    if ( !validMethod.includes( transactionInfo.method ) )
      return enqueueSnackbar('La información del pago es incorrecta', { variant: 'warning' });

    if ( transactionInfo.method === 'Pago móvil' && ( !transactionInfo.transactionId.trim() || !transactionInfo.phone.trim() ) )
      return enqueueSnackbar('La información del pago está incompleta', { variant: 'warning' });

    setIsLoading( true );

    const res = await dbOrders.createNewOrder({
      userId: user._id,
      cart,
      shippingAddress: direction,
      contact,
      transaction: transactionInfo,
    });

    if ( res.error ) {
      enqueueSnackbar(res.message, { variant: 'error' });
      setIsLoading( false );
      return;
    }

    if ( checkboxInfo ) window.localStorage.setItem('mpr__shopInfo', JSON.stringify({ direction, contact }));
    
    enqueueSnackbar(res.message, { variant: 'success' });
    setExistencyChecked( false );
    setIsLoading( false );
    setTransaction({ method: '', transactionId: '', phone: '' });
    return;
  }

  const handleCheckExistency = async () => {
    if ( !user || !user._id ) {
      router.push('/auth?p=/tienda/carrito');
      return;
    }

    if ( direction.address.trim().length < 5 )
      return enqueueSnackbar('Necesitamos una dirección de entrega completa', { variant: 'warning' });

    if ( Object.values( direction.maps ).filter(m => m).length !== 2 )
      return enqueueSnackbar('Necesitamos la ubicación por Maps', { variant: 'warning' });

    if ( contact.name.trim().length < 2 )
      return enqueueSnackbar('Necesitamos el nombre del comprador', { variant: 'warning' });
    
    if ( Object.values( contact ).filter(c => c.trim()).length < 2 )
      return enqueueSnackbar('Necesitamos al menos un método de contacto', { variant: 'warning' });

    setIsLoading( true );

    const res = await dbProducts.checkProductsExistency( cart.map(({ _id, name, quantity, size }) => ({ _id, name, quantity, size })) );

    if ( res.error && res.payload.length > 0 ) res.payload.forEach(( message ) => enqueueSnackbar(message, { variant: !res.error ? 'success' : 'error', autoHideDuration: 12000 }));
    !res.error && res.message && enqueueSnackbar(res.message, { variant: 'success' });
    !res.error && res.message && setExistencyChecked( true );

    setIsLoading( false );

    setTimeout(() => setExistencyChecked( false ), 180000);
  }

  const handleLocation = () => {
    setIsLoading( true );
    
    setDirection(({ ...direction, maps: { latitude: null, longitude: null } }));
    
    const success: PositionCallback = function( position ) {
      setIsLoading( false );
      setDirectionError('');

      const { latitude, longitude, accuracy } = position.coords;

      if ( accuracy > 55 ) {
        setDirectionError('La precisión fue baja. Por favor inténtalo de nuevo.');
        setTimeout(() => setDirectionError(''), 15000);
        return;
      }
      
      const distance = haversine(
        { longitude: Number(process.env.NEXT_PUBLIC_MPR_LONGITUDE || 0), latitude: Number(process.env.NEXT_PUBLIC_MPR_LATITUDE  || 0)},
        { longitude, latitude },
      );

      if ( distance > 11000 ) {
        setDirectionError('Vaya, parece que estás muy lejos. No llegamos hasta tu ubicación.');
        setTimeout(() => setDirectionError(''), 30000);
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

    setIsLoading( true );
    const resRev = await mprRevalidatePage('/tienda/carrito');
    setIsLoading( false );

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
                          ? format(
                            cart.reduce(( prev, { quantity, price, discount } ) => prev + quantity * ( price * ( 1 - discount ) ), 0)
                          )
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
                      disabled={ existencyChecked }
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
                      disabled={ existencyChecked }
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
                      disabled={ existencyChecked }
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
                      disabled={ existencyChecked }
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
                      disabled={ existencyChecked }
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

                  { existencyChecked ||
                    <>
                    <Box className='fadeIn' display='flex' alignItems='center' sx={{ maxWidth: '300px' }}>
                      <p className='p'>Antes de hacer una compra, pulse aquí para verificar la existencia en stock de los productos.</p>
                    </Box>

                    <Button
                      className='fadeIn'
                      color='secondary'
                      fullWidth
                      sx={{ fontSize: '.9rem', padding: '.2rem .4rem' }}
                      disabled={ existencyChecked || cart.length < 1 || isLoading }
                      onClick={ handleCheckExistency }
                    >
                      Verificar existencias
                    </Button>
                    </>
                  }

                  { existencyChecked &&
                    <Box className='fadeIn' display='flex' gap='.5rem'>
                      <Button
                        color='secondary'
                        disabled={ cart.length < 1 || isLoading || !existencyChecked }
                        sx={{ fontSize: '.9rem', padding: '.2rem .4rem', flexGrow: 1 }}
                        onClick={ () => setTransaction({ transactionId: '', method: 'Paypal', phone: '' }) }
                      >
                        Pagar con PayPal
                      </Button>

                      <Button
                        color='secondary'
                        disabled={ cart.length < 1 || isLoading || !existencyChecked }
                        sx={{ fontSize: '.9rem', padding: '.2rem .4rem', flexGrow: 1 }}
                        onClick={ () => setTransaction({ transactionId: '', method: 'Pago móvil', phone: '' }) }
                      >
                        Pagar con Pago móvil
                      </Button>
                    </Box>
                  }

                  {
                    transaction.method === 'Pago móvil' && existencyChecked &&
                      <Box className='fadeIn' sx={{ mt: 1 }}>
                        <Typography sx={{ fontSize: '1.1rem', fontWeight: '600' }}>Pago móvil</Typography>
                        
                        <Box sx={{ mb: 1 }}>
                          <p className='p'>Número de télefono: 0414 1111111</p>
                          <p className='p'>Banco: Mercantil</p>
                          <p className='p'>C.I.: 11.111.111</p>
                          <p className='p'>Monto: Bs. { (getTotal() * dolarPrice).toFixed( 2 ) }</p>
                        </Box>

                        <Box sx={{ mb: 1 }}>
                          <TextField
                            name='pmcode'
                            value={ transaction.transactionId }
                            label='Código de verificación'
                            type='text'
                            color='secondary'
                            variant='filled'
                            fullWidth
                            onChange={ ({ target }) => setTransaction({ ...transaction, transactionId: target.value }) }
                          />
                        </Box>

                        <Box sx={{ mb: 1 }}>
                          <TextField
                            name='pmnumber'
                            value={ transaction.phone }
                            label='Número de teléfono'
                            type='text'
                            color='secondary'
                            variant='filled'
                            fullWidth
                            onChange={ ({ target }) => setTransaction({ ...transaction, phone: target.value }) }
                          />
                        </Box>

                        <Button
                          className='fadeIn'
                          color='secondary'
                          fullWidth
                          disabled={ cart.length < 1 || isLoading || !existencyChecked }
                          sx={{ fontSize: '1rem' }}
                          onClick={ () => handleCheckout({ method: 'Pago móvil', transactionId: transaction.transactionId, phone: transaction.phone }) }
                        >
                          Crear orden
                        </Button>
                      </Box>
                  }

                  { transaction.method === 'Paypal' && existencyChecked &&
                      <Box className='fadeIn' sx={{ mt: 1 }}>
                        <Typography sx={{ fontSize: '1.2rem', fontWeight: '600' }}>PayPal</Typography>

                        <Typography sx={{ fontSize: '1.1rem' }}>Cuenta de prueba</Typography>
                        <Typography>Correo: mpr_buyer@gmail.com</Typography>
                        <Typography>Clave: 123456789</Typography>

                        <PayPalButtons
                        createOrder={(data, actions) => {
                          return actions.order.create({
                              purchase_units: [
                                  {
                                      amount: {
                                          value: `${ getTotal() }`,
                                      },
                                  },
                              ],
                          });
                        }}
                        onApprove={(data, actions) => {
                          return actions.order!.capture().then((details) => {
                              console.log({ details });
                              handleCheckout({ transactionId: details.id, phone: '', method: 'Paypal' });
                          });
                        }}
                      />
                      </Box>
                  }
              </CardContent>
            </Card>
          </Box>
          
        </Box>
        
        <>
          { user && ( user.role === 'admin' || user.role === 'superuser' ) &&
            <Button className='fadeIn' variant='contained' color='secondary' sx={{ mt: 2 }} onClick={ revalidate }>Revalidar esta página</Button>
          }
        </>

    </ShopLayout>
  )
};

export const getStaticProps: GetStaticProps = async ( ctx ) => {

  // const products = await dbProducts.getAllProducts();

  // if ( !products ) {
  //   throw new Error("Failed to fetch products, check server's logs");
  // }

  const dolar = await dbProducts.backGetDolarPrice();

  if ( !dolar )
    throw new Error('Ocurrió un error obteniendo el valor del dólar de la DB');

  return {
    props: {
      // allProducts: products,
      dolarPrice: dolar
    },
    revalidate: 3600 * 24 // 4h
  }
}

export default CarritoPage;
