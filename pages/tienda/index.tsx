import { useContext, useState } from 'react';
import { NextPage, GetStaticProps } from 'next';
import { useSession } from 'next-auth/react';
import { Box, Button, Checkbox, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { ShoppingBag } from '@mui/icons-material'
import { useSnackbar } from 'notistack';
import { isMonday, isToday } from 'date-fns';

import { dbProducts, dbSolds } from '../../database';
import { ScrollContext } from '../../context';
import { mprRevalidatePage } from '../../mprApi';
import { ShopLayout, ContainerProductType, ContainerFavProduct } from '../../components'
import { IProduct, Tags, TagsArray } from '../../interfaces'
import styles from '../../styles/Tienda.module.css';
import { ConfirmNotificationButtons, PromiseConfirmHelper } from '../../utils';

interface Props {
  products: IProduct[];
  mostSoldProducts: IProduct[];
  dolar: number;
}

const TiendaPage: NextPage<Props> = ({ products, mostSoldProducts, dolar }) => {

  const { data: thisSession } = useSession();
  const session: any = thisSession;
  const { enqueueSnackbar } = useSnackbar();
  const { setIsLoading } = useContext( ScrollContext );
  
  const [formTags, setFormTags] = useState({
    tags: 'todos',
    discount: 0,
  });

  const [formSlug, setFormSlug] = useState({
    slug: '',
    discount: 0,
  });

  const [revalidatePage, setRevalidatePage] = useState( false );
  const [dolarPrice, setDolarPrice] = useState( 0 );

  const handleDiscount = async ( form: 'tags' | 'slug' ) => {
    if ( form === 'slug' && !formSlug.slug ) return enqueueSnackbar('Agrega un url', { variant: 'warning' });

    let key = enqueueSnackbar('¿Quieres aplicar el descuento?', {
      variant: 'info',
      action: ConfirmNotificationButtons,
      autoHideDuration: 15000,
    });

    const accepted = await PromiseConfirmHelper(key, 15000);

    if ( !accepted ) return;

    setIsLoading( true );
    
    const res = await dbProducts.discountProducts( form, form === 'tags' ? formTags.discount : formSlug.discount, form === 'tags' ? formTags.tags : formSlug.slug );
    
    enqueueSnackbar(res.message, { variant: !res.error ? 'success' : 'error' });
    
    if ( res.error ) {
      setIsLoading( false );
      enqueueSnackbar(res.message, { variant: !res.error ? 'success' : 'error' });
      return;
    };

    if ( process.env.NODE_ENV === 'production' && revalidatePage ) {
      const revalidationResponses = await Promise.all([
        mprRevalidatePage('/tienda'),
        mprRevalidatePage('/tienda/categoria'),
        // mprRevalidatePage('/tienda/carrito'),
      ]);

      revalidationResponses.forEach(res => enqueueSnackbar(res.message || 'Error revalidando', { variant: !res.error ? 'info' : 'error' }));
      
      if ( form === 'slug' ) {
        const revRes2 = await mprRevalidatePage( '/tienda' + formSlug.slug.startsWith('/') ? formSlug.slug : `/${ formSlug.slug }` );
        enqueueSnackbar(revRes2.message || 'Error revalidando el producto', { variant: !revRes2.error ? 'info' : 'error' });
        setIsLoading( false );
        return;
      };
      
      if ( formTags.tags === 'todos' ) {
        const slugsToRevalidate = products.map(p => p.slug.startsWith('/') ? p.slug : `/${ p.slug }`);
        const revalidationResponses = await Promise.all( slugsToRevalidate.map(s => mprRevalidatePage( '/tienda' + s )) );

        revalidationResponses.filter(r => r.error).forEach(res => enqueueSnackbar(res.message || 'Error revalidando un producto', { variant: 'error' }));
      } else {
        const slugsToRevalidate = products.filter(p => p.tags.includes(formTags.tags as Tags)).map(p => p.slug.startsWith('/') ? p.slug : `/${ p.slug }`);
        const revalidationResponses = await Promise.all( slugsToRevalidate.map(s => mprRevalidatePage( '/tienda' + s )) );

        revalidationResponses.filter(r => r.error).forEach(res => enqueueSnackbar(res.message || 'Error revalidando un producto', { variant: 'error' }));
      }
    };

    setIsLoading( false );
    return;
  }

  const handleUpdateDolar = async () => {
    if ( dolarPrice === 0 ) return enqueueSnackbar('El valor no es válido', { variant: 'warning' });

    let key = enqueueSnackbar('¿Quieres actualizar el valor del dólar?', {
        variant: 'info',
        action: ConfirmNotificationButtons,
        autoHideDuration: 15000,
    });

    const accepted = await PromiseConfirmHelper(key, 15000);

    if ( !accepted ) return;

    const res = await dbProducts.updateDolarPrice( dolarPrice );

    enqueueSnackbar(res.message, { variant: !res.error ? 'success' : 'error' });
  }
  
  const revalidate = async () => {
    if ( process.env.NODE_ENV !== 'production' ) return;

    setIsLoading( true );
    const resRev = await mprRevalidatePage('/tienda');
    setIsLoading( false );

    enqueueSnackbar(resRev.message, { variant: !resRev.error ? 'success' : 'error' });
  }
 
  return (
    <ShopLayout title={ 'Tienda Virtual' } pageDescription={ 'Tienda virtual oficial de nuestra fundación MPR. Aquí encontrarás todo tipo de artículos para tu mejor amig@ y mascota.' } titleIcon={ <ShoppingBag color='info' sx={{ fontSize: '1.5rem' }} /> } nextPage={ '/' } main>
        
        <Box display='flex' sx={{ mb: 1 }}>
          <Typography sx={{ fontSize: '1.2rem', fontWeight: '500', padding: '.4rem 1rem .5rem', borderRadius: '.3rem', color: '#fbfbfb', backgroundColor: 'var(--secondary-color-2)', position: 'relative', boxShadow: '-.4rem .4rem .6rem -.5rem #444' }}>La tasa de hoy es Bs. { dolar } x 1$</Typography>
        </Box>
        
        <ContainerFavProduct products={ mostSoldProducts } />

        <Typography>¡Bienvenido a nuestra tienda online!</Typography>

        <Typography>Aquí podrás encontrar todo tipo de artículos para los más consentidos de la casa.</Typography>

        <Typography>Explora todos nuestros productos o usa nuestro buscador para encontrar uno en particular.</Typography>

        <>
          {
            TagsArray.map((tag: Tags) => <ContainerProductType key={ tag } type={ tag } products={ products.filter(p => p.tags.includes( tag )) } more limit />)
          }
        </>

        <>
        { session && session.user && ( session.user.role === 'superuser' || session.user.role === 'admin' ) &&
          <>
          <Box display='flex' flexDirection='column' gap='1rem' sx={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '1.2rem', boxShadow: '0 0 1rem -.6rem #444' }}>
              
            <Box>
              <Typography sx={{ fontSize: '1.3rem', fontWeight: 'bold' }}>Cambiar cotización del dólar</Typography>
              <Box display='flex' gap='.5rem'>
                <TextField
                  name='dolar'
                  value={ dolarPrice }
                  label='Valor del dólar'
                  type='number'
                  color='secondary'
                  variant='filled'
                  onChange={ ( e ) => {
                    if ( isNaN(Number( e.target.value )) ) return;
                    setDolarPrice( Number( e.target.value ) );
                  }}
                />
                <Button color='secondary' onClick={ handleUpdateDolar }>Aplicar</Button>
              </Box>
            </Box>

            <Box>
              <Typography sx={{ fontSize: '1.3rem', fontWeight: 'bold' }}>Aplicar descuento a varios productos</Typography>
            </Box>

            <Box display='flex' gap='.5rem' sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
              <FormControl fullWidth>
              <InputLabel id="form-tags" color='secondary'>Etiquetas</InputLabel>
                <Select
                  labelId="form-tags"
                  value={ formTags.tags }
                  label="Etiquetas"
                  color='secondary'
                  onChange={ ( e: any ) => setFormTags({ ...formTags, tags: e.target.value }) }
                >
                  <MenuItem value={ 'todos' }>todos</MenuItem>
                  <MenuItem value={ 'accesorios' }>accesorios</MenuItem>
                  <MenuItem value={ 'consumibles' }>consumibles</MenuItem>
                  <MenuItem value={ 'ropa' }>ropa</MenuItem>
                  <MenuItem value={ 'útil' }>útil</MenuItem>
                </Select>
              </FormControl>

              <TextField
                  name='discount'
                  value={ formTags.discount }
                  label='Descuento a aplicar (%)'
                  type='number'
                  color='secondary'
                  variant='filled'
                  fullWidth
                  onChange={ ( e ) => {
                    if ( isNaN(Number( e.target.value )) ) return;
                    if ( Number( e.target.value ) > 50 || Number( e.target.value ) < 0 ) return;
                    setFormTags({ ...formTags, discount: Number(e.target.value) });
                  }}
              />

              <Button color='info' sx={{ backgroundColor: 'var(--secondary-color-1)' }} onClick={ () => handleDiscount('tags') }>Aplicar</Button>
            </Box>

            <Box>
              <Typography sx={{ fontSize: '1.3rem', fontWeight: 'bold' }}>Aplicar descuento a un producto (por url)</Typography>
            </Box>

            <Box display='flex' gap='.5rem' sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                name='url'
                value={ formSlug.slug.trim() }
                label='Url del producto'
                type='string'
                color='secondary'
                variant='filled'
                fullWidth
                onChange={ ( e ) => setFormSlug({ ...formSlug, slug: e.target.value }) }
              />

              <TextField
                  name='discount'
                  value={ formSlug.discount }
                  label='Descuento a aplicar (%)'
                  type='number'
                  color='secondary'
                  variant='filled'
                  fullWidth
                  onChange={ ( e ) => {
                    if ( isNaN(Number( e.target.value )) ) return;
                    if ( Number( e.target.value ) > 50 || Number( e.target.value ) < 0 ) return;
                    setFormSlug({ ...formSlug, discount: Number(e.target.value) });
                  }}
                  />

              <Button color='info' sx={{ backgroundColor: 'var(--secondary-color-1)' }} onClick={ () => handleDiscount('slug') }>Aplicar</Button>
            </Box>
            <Box display='flex' alignItems='center'>
              <Checkbox
                  color='secondary'
                  checked={ revalidatePage }
                  onChange={ ({ target }) => setRevalidatePage( target.checked ) }
                />
              <Typography sx={{ cursor: 'pointer' }} onClick={ () => setRevalidatePage( !revalidatePage ) }>Revalidar página</Typography>
            </Box>
          </Box>
          <Button className='fadeIn' variant='contained' color='secondary' sx={{ mt: 2 }} onClick={ revalidate }>Revalidar esta página</Button>
          </>
        }
        </>
        
    </ShopLayout>
  )
}

export const getStaticProps: GetStaticProps = async ( ctx ) => {

    const dolar = await dbProducts.backGetDolarPrice();

    if ( !dolar )
      throw new Error('Ocurrió un error obteniendo el valor del dólar de la DB');

    const products = await dbProducts.getAllProducts();

    if ( !products )
        throw new Error('Ocurrió un error obteniendo los productos de la DB');
        
    const solds = await dbSolds.getSoldProducts();
        
    if ( !solds )
        throw new Error('Ocurrió un error obteniendo los productos vendidos de la DB');

    const mostSoldProducts = products.map(( product ) => {
      const soldProduct = solds.find(( sold ) => sold.productId.toString() === product._id.toString()) || { soldUnits: 0 };

      return {
        ...product,
        sold: product.sold - soldProduct.soldUnits,
      }
    }).sort((a: IProduct, b: IProduct) => b.sold - a.sold).slice(0, 4);

    if ( isMonday( (() => Date.now())() ) ) {
      // @ts-ignore
      const notAllUpdatedToday = solds.filter(s => !isToday( s.updatedAt )).length > 0;
      
      if ( notAllUpdatedToday ) {
        const updatedAt = (() => Date.now())();
        const updatedSoldProducts = products.map(( product ) => ({ _id: '', productId: product._id, soldUnits: product.sold, updatedAt }));
      
        const res = await dbSolds.updateSoldProducts( updatedSoldProducts );
  
        console.log( res ? 'Productos vendidos actualizados' : 'No se actualizaron los productos vendidos' );
      }
    }

    return {
      props: {
        mostSoldProducts,
        products,
        dolar,
      },
      revalidate: 86400, // cada 24h
    }
}

export default TiendaPage;