import { useContext, useEffect, useState, useRef } from 'react';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { Box, Button, Card, CardContent, Checkbox, Divider, TextField, Typography } from '@mui/material';
import AddShoppingCart from '@mui/icons-material/AddShoppingCart';
import Check from '@mui/icons-material/Check';
import RemoveShoppingCart from '@mui/icons-material/RemoveShoppingCart';
import ShoppingBag from '@mui/icons-material/ShoppingBag';
import { useSnackbar } from 'notistack';

import { mprRevalidatePage } from '../../mprApi';
import { dbOrders, dbProducts } from '../../database';
import { AuthContext, CartContext, ScrollContext } from '../../context';
import { CartProductInfo, ShopLayout } from '../../components';
import { ConfirmNotificationButtons, format, PromiseConfirmHelper } from '../../utils';
import haversine from 'haversine-distance';

interface Props {
  dolarPrice: number;
}

const CarritoPage: NextPage<Props> = ({ dolarPrice }) => {

  const router = useRouter();
  const { user } = useContext(AuthContext);
  const { cart, clearCart, getTotal, numberOfItems } = useContext(CartContext);
  const { isLoading, setIsLoading } = useContext(ScrollContext);
  const { enqueueSnackbar } = useSnackbar();

  const name = useRef<HTMLInputElement>(null);
  const facebook = useRef<HTMLInputElement>(null);
  const instagram = useRef<HTMLInputElement>(null);
  const whatsapp = useRef<HTMLInputElement>(null);
  const checkboxInfo = useRef<HTMLInputElement>(null);
  const address = useRef<HTMLInputElement>(null);
  const pmcode = useRef<HTMLInputElement>(null);
  const pmnumber = useRef<HTMLInputElement>(null);

  const [maps, setMaps] = useState<{ latitude: number | null; longitude: number | null; }>({ latitude: null, longitude: null });

  const [directionError, setDirectionError] = useState('');
  const [existencyChecked, setExistencyChecked] = useState(false);
  const [method, setMethod] = useState<'Pago móvil' | 'Paypal' | ''>('');


  useEffect(() => {
    let shopInfo = JSON.parse(window.localStorage.getItem('mpr__shopInfo') || '{ "any": "" }');
    if (shopInfo === undefined || shopInfo === null || shopInfo.any === '' || Object.values(shopInfo.contact).filter(c => c).length < 2 || Object.values(shopInfo.direction.maps).filter(d => d).length < 2) return;

    address.current!.value = shopInfo.direction.address;
    name.current!.value = shopInfo.contact.name;
    facebook.current!.value = shopInfo.contact.facebook;
    instagram.current!.value = shopInfo.contact.instagram;
    whatsapp.current!.value = shopInfo.contact.whatsapp;

    setMaps(shopInfo.direction.maps);
  }, []);


  useEffect(() => setExistencyChecked(false), [cart]);


  const cleaningCart = async () => {
    let key = enqueueSnackbar('¿Quieres vaciar el carrito?', {
      variant: 'info',
      autoHideDuration: 15000,
      action: ConfirmNotificationButtons
    });

    const confirm = await PromiseConfirmHelper(key, 15000);

    confirm && clearCart();
    return;
  }


  const handleCheckout = async (transactionInfo: { method: string; transactionId: string; phone: string; }) => {
    if (!user || !user._id) {
      router.push('/auth?p=/tienda/carrito');
      return;
    }

    const validMethod = ['Pago móvil', 'Paypal'];

    if (!validMethod.includes(transactionInfo.method))
      return enqueueSnackbar('La información del pago es incorrecta', { variant: 'warning' });

    if (name.current!.value.trim().length < 2)
      return enqueueSnackbar('Necesitamos el nombre del comprador', { variant: 'warning' });

    if (facebook.current!.value.trim().length < 2 && instagram.current!.value.trim().length < 2 && whatsapp.current!.value.trim().length < 2)
      return enqueueSnackbar('Necesitamos al menos un método de contacto', { variant: 'warning' });

    if (transactionInfo.method === 'Pago móvil' && (transactionInfo.transactionId.trim().length < 4 || transactionInfo.phone.trim().length < 9))
      return enqueueSnackbar('La información del pago está incompleta', { variant: 'warning' });

    if (address.current!.value.trim().length < 5)
      return enqueueSnackbar('Necesitamos una dirección de entrega completa', { variant: 'warning' });

    if (Object.values(maps).filter(m => m).length !== 2)
      return enqueueSnackbar('Necesitamos la ubicación por Maps', { variant: 'warning' });

    setIsLoading(true);

    const res = await dbOrders.createNewOrder({
      userId: user._id,
      cart,
      shippingAddress: {
        address: address.current!.value,
        maps,
      },
      contact: {
        name: name.current!.value,
        facebook: facebook.current!.value,
        instagram: instagram.current!.value,
        whatsapp: whatsapp.current!.value,
      },
      transaction: transactionInfo,
    });

    if (res.error) {
      enqueueSnackbar(res.message, { variant: 'error' });
      setIsLoading(false);
      return;
    }

    // @ts-ignore
    if (checkboxInfo.current!.checked) window.localStorage.setItem('mpr__shopInfo', JSON.stringify({
      direction: {
        address: address.current!.value,
        maps
      },
      contact: {
        name: name.current!.value,
        facebook: facebook.current!.value,
        instagram: instagram.current!.value,
        whatsapp: whatsapp.current!.value
      }
    }));

    enqueueSnackbar(res.message, { variant: 'success' });
    setExistencyChecked(false);
    setIsLoading(false);
    setMethod('');
    clearCart();

    if (pmcode.current && pmnumber.current) {
      pmcode.current.value = '';
      pmnumber.current.value = '';
    }
    return;
  }


  const handleCheckExistency = async () => {
    if (!user || !user._id) {
      router.push('/auth?p=/tienda/carrito');
      return;
    }

    if (address.current!.value.trim().length < 5)
      return enqueueSnackbar('Necesitamos una dirección de entrega completa', { variant: 'warning' });

    if (Object.values(maps).filter(m => m).length !== 2)
      return enqueueSnackbar('Necesitamos la ubicación por Maps', { variant: 'warning' });

    if (name.current!.value.trim().length < 2)
      return enqueueSnackbar('Necesitamos el nombre del comprador', { variant: 'warning' });

    if (facebook.current!.value.trim().length < 2 && instagram.current!.value.trim().length < 2 && whatsapp.current!.value.trim().length < 2)
      return enqueueSnackbar('Necesitamos al menos un método de contacto', { variant: 'warning' });

    setIsLoading(true);

    const res = await dbProducts.checkProductsExistency(cart.map(({ _id, name, quantity, size }) => ({ _id, name, quantity, size })));

    if (res.error && res.payload.length > 0) res.payload.forEach((message) => enqueueSnackbar(message, { variant: !res.error ? 'success' : 'error', autoHideDuration: 12000 }));
    !res.error && res.message && enqueueSnackbar(res.message, { variant: 'success' });
    !res.error && res.message && setExistencyChecked(true);

    setIsLoading(false);

    setTimeout(() => setExistencyChecked(false), 200000);
  }


  const handleLocation = () => {
    setIsLoading(true);

    setMaps({ latitude: null, longitude: null });

    const success: PositionCallback = function (position) {
      setIsLoading(false);
      setDirectionError('');

      const { latitude, longitude, accuracy } = position.coords;

      // if (accuracy > 55) {
      //   setDirectionError('La precisión fue baja. Por favor inténtalo de nuevo.');
      //   return;
      // }

      const distance = haversine(
        { longitude: Number(process.env.NEXT_PUBLIC_MPR_LONGITUDE || 0), latitude: Number(process.env.NEXT_PUBLIC_MPR_LATITUDE || 0) },
        { longitude, latitude },
      );

      if (distance > 11000) {
        setDirectionError('Vaya, parece que estás muy lejos. No llegamos hasta tu ubicación.');
        return;
      }

      setMaps({
        latitude,
        longitude,
      })
    }

    const error: PositionErrorCallback = function (err) {
      setIsLoading(false);
      setDirectionError('Ocurrió un error con tu ubicación. Por favor vuelve a intentarlo.');
    }

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
  }


  const revalidate = async () => {
    if (process.env.NODE_ENV !== 'production') return;

    setIsLoading(true);
    const resRev = await mprRevalidatePage('/tienda/carrito');
    setIsLoading(false);

    enqueueSnackbar(resRev.message, { variant: !resRev.error ? 'success' : 'error' });
  }

  return (
    <ShopLayout title={'Carrito de compras'} H1={'Tienda'} pageDescription={'Carrito de compras, lista de productos'} nextPage={'/tienda'} titleIcon={<ShoppingBag color='info' sx={{ fontSize: '1.5rem' }} />} url='/tienda/carrito'>
      <Typography sx={{ fontSize: '1.4rem', fontWeight: '600', color: '#333', mb: 3 }}>Tu carrito <AddShoppingCart color='secondary' sx={{ transform: 'translateY(6px)' }} /></Typography>

      <Box display='flex' gap='.5rem' flexWrap='wrap'>
        <Box display='flex' flexDirection='column' gap='1.5rem' alignItems='center' flexGrow={1}>
          {
            cart.map((product) => <CartProductInfo key={product._id + product.size} product={product} />)
          }

          {(numberOfItems > 0)
            ? (
              <Button
                variant='outlined'
                color='secondary'
                sx={{ fontSize: '1rem', alignSelf: 'stretch' }}
                onClick={cleaningCart}>
                Vaciar carrito
              </Button>
            )
            : <Typography>No tienes nada en el carrito <RemoveShoppingCart sx={{ transform: { xs: 'translateY(4px)', sm: 'translateY(6px)', md: 'translateY(8px)' } }} color='secondary' /></Typography>
          }
        </Box>

        <Box flexGrow={1}>
          <Card>
            <CardContent>
              <Typography sx={{ fontSize: '1.3rem', fontWeight: '700' }}>Productos</Typography>
              {
                (cart.length > 0)
                  ? cart.map((p, index) =>
                    <Box key={p.name + index} display='flex' justifyContent='space-between'>
                      <Typography>
                        {p.name}{p.size !== 'unique' ? ` (${p.size})` : ''}
                      </Typography>
                      <Typography textAlign='end'>
                        {p.discount > 0 && p.discount < 0.5 ? format(p.price - p.discount * p.price) : format(p.price)} x {p.quantity} = {format((p.price - p.discount * p.price) * p.quantity)}
                      </Typography>
                    </Box>
                  )
                  : <Typography>¡El carrito está vacío!</Typography>
              }

              <Divider sx={{ my: 1 }} />

              <Box display='flex' justifyContent='space-between' alignItems='center'>
                <Typography sx={{ fontSize: '1.3rem', fontWeight: '700' }}>Total</Typography>
                <Typography>
                  {(cart.length > 0)
                    ? format(
                      cart.reduce((prev, { quantity, price, discount }) => prev + quantity * (price * (1 - discount)), 0)
                    )
                    : format(0)
                  }
                </Typography>
              </Box>

              <Divider sx={{ my: 1 }} />

              <Typography sx={{ fontSize: '1.3rem', fontWeight: '700' }}>Tu Dirección</Typography>

              <Box sx={{ mb: 1 }}>
                <TextField
                  inputRef={address}
                  name='address'
                  label='Descripción de tu ubicación'
                  type='text'
                  color='secondary'
                  variant='filled'
                  multiline
                  fullWidth
                  disabled={existencyChecked}
                />
              </Box>

              <Box sx={{ mb: 1 }} display='flex' flexDirection='column'>
                <Button color='secondary' disabled={isLoading} sx={{ py: 1, fontSize: '1rem' }} onClick={handleLocation}>Obtener ubicación en Maps</Button>
                {maps.latitude && maps.longitude &&
                  <Box display='flex' gap='.5rem' className='fadeIn' sx={{ maxWidth: 'max(250px, 20rem)', borderRadius: '10rem', mt: 1, padding: '.4rem 1rem .4rem .5rem', fontWeight: '600', backgroundColor: 'var(--success-color)' }}>
                    <Check color='info' />
                    <Typography sx={{ color: '#fafafa' }}>Tu ubicación es válida</Typography>
                  </Box>
                }
                {directionError &&
                  <Box display='flex' gap='.5rem' className='fadeIn' sx={{ maxWidth: 'max(250px, 22rem)', borderRadius: '10rem', mt: 1, padding: '.4rem 1rem', fontWeight: '600', fontSize: '.9rem', backgroundColor: 'var(--error-color)' }}>
                    <Typography sx={{ color: '#fafafa' }}>{directionError}</Typography>
                  </Box>
                }
              </Box>

              <Divider sx={{ my: 1 }} />

              <Typography sx={{ fontSize: '1.3rem', fontWeight: '700' }}>Contacto</Typography>

              <Box sx={{ mb: 1 }}>
                <TextField
                  inputRef={name}
                  name='name'
                  label='Nombre de la persona'
                  type='text'
                  color='secondary'
                  variant='filled'
                  fullWidth
                  disabled={existencyChecked}
                />
              </Box>

              <Typography sx={{ fontSize: '.9rem', color: '#666', mt: 3 }}>¡Necesario al menos uno!</Typography>

              <Box sx={{ mb: 1 }}>
                <TextField
                  inputRef={facebook}
                  name='facebook'
                  label='Facebook'
                  type='text'
                  color='secondary'
                  variant='filled'
                  fullWidth
                  disabled={existencyChecked}
                />
              </Box>

              <Box sx={{ mb: 1 }}>
                <TextField
                  inputRef={instagram}
                  name='instagram'
                  label='Instagram'
                  type='text'
                  color='secondary'
                  variant='filled'
                  fullWidth
                  disabled={existencyChecked}
                />
              </Box>

              <Box sx={{ mb: 1 }}>
                <TextField
                  inputRef={whatsapp}
                  name='whatsapp'
                  label='Whatsapp'
                  type='text'
                  color='secondary'
                  variant='filled'
                  fullWidth
                  disabled={existencyChecked}
                />
              </Box>

              <Box display='flex' justifyContent='flex-start' alignItems='center'>
                <Checkbox
                  id='checkboxInfo'
                  inputRef={checkboxInfo}
                  color='secondary'
                />
                <label htmlFor='checkboxInfo' style={{ flexGrow: 1 }}>Guardar información</label>
              </Box>

              <Divider sx={{ my: 1 }} />

              {existencyChecked ||
                <>
                  <Box className='fadeIn' display='flex' alignItems='center' sx={{ maxWidth: { xs: '280px', sm: '320px', md: '400px' } }}>
                    <p className='p'>Pulse aquí para verificar la existencia en stock de los productos.</p>
                  </Box>

                  <Button
                    className='fadeIn'
                    color='secondary'
                    fullWidth
                    sx={{ fontSize: '.9rem', padding: '.2rem .4rem' }}
                    disabled={existencyChecked || cart.length < 1 || isLoading}
                    onClick={handleCheckExistency}
                  >
                    Verificar existencias
                  </Button>
                </>
              }

              {existencyChecked &&
                <Box className='fadeIn' display='flex' gap='.5rem'>
                  <Button
                    color='secondary'
                    disabled={cart.length < 1 || isLoading || !existencyChecked}
                    sx={{ fontSize: '.9rem', padding: '.2rem .4rem', flexGrow: 1 }}
                    onClick={() => setMethod('Paypal')}
                  >
                    Pagar con PayPal
                  </Button>

                  <Button
                    color='secondary'
                    disabled={cart.length < 1 || isLoading || !existencyChecked}
                    sx={{ fontSize: '.9rem', padding: '.2rem .4rem', flexGrow: 1 }}
                    onClick={() => setMethod('Pago móvil')}
                  >
                    Pagar con Pago móvil
                  </Button>
                </Box>
              }

              {
                method === 'Pago móvil' && existencyChecked &&
                <Box className='fadeIn' sx={{ mt: 1 }}>
                  <Typography sx={{ fontSize: '1.1rem', fontWeight: '600' }}>Pago móvil</Typography>

                  <Box sx={{ mb: 1 }}>
                    <p className='p'>Número de télefono: 0414 1111111</p>
                    <p className='p'>Banco: Mercantil</p>
                    <p className='p'>C.I.: 11.111.111</p>
                    <p className='p'>Monto: Bs. {(getTotal() * dolarPrice).toFixed(2)}</p>
                  </Box>

                  <Box sx={{ mb: 1 }}>
                    <TextField
                      inputRef={pmcode}
                      name='pmcode'
                      label='Código de verificación'
                      type='text'
                      color='secondary'
                      variant='filled'
                      fullWidth
                    />
                  </Box>

                  <Box sx={{ mb: 1 }}>
                    <TextField
                      inputRef={pmnumber}
                      name='pmnumber'
                      label='Número de teléfono'
                      type='text'
                      color='secondary'
                      variant='filled'
                      fullWidth
                    />
                  </Box>

                  <Button
                    className='fadeIn'
                    color='secondary'
                    fullWidth
                    disabled={cart.length < 1 || isLoading || !existencyChecked}
                    sx={{ fontSize: '1rem' }}
                    onClick={() => handleCheckout({ method: 'Pago móvil', transactionId: pmcode.current!.value, phone: pmnumber.current!.value })}
                  >
                    Crear orden
                  </Button>
                </Box>
              }

              {method === 'Paypal' && existencyChecked &&
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
                              value: `${getTotal()}`,
                            },
                          },
                        ],
                      });
                    }}
                    onApprove={(data, actions) => {
                      return actions.order!.capture().then((details) => {
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
        {user && (user.role === 'admin' || user.role === 'superuser') &&
          <Button className='fadeIn' variant='contained' color='secondary' sx={{ mt: 2 }} onClick={revalidate}>Revalidar esta página</Button>
        }
      </>

    </ShopLayout>
  )
};

export const getStaticProps: GetStaticProps = async (ctx) => {

  const dolar = await dbProducts.backGetDolarPrice();

  if (!dolar)
    throw new Error('Ocurrió un error obteniendo el valor del dólar de la DB');

  return {
    props: {
      dolarPrice: dolar
    },
  }
}

export default CarritoPage;
