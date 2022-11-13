import { useContext, useState } from 'react';
import { NextPage, GetStaticProps } from 'next';
import { useSession } from 'next-auth/react';
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { ShoppingBag } from '@mui/icons-material'
import { useSnackbar } from 'notistack';

import { dbProducts } from '../../database';
import { mprRevalidatePage } from '../../mprApi';
import { ScrollContext } from '../../context';
import { ShopLayout, ContainerProductType, ContainerFavProduct } from '../../components'
import { IProduct, Tags, TagsArray } from '../../interfaces'
import styles from '../../styles/Tienda.module.css'

interface Props {
  products: IProduct[];
}

const TiendaPage: NextPage<Props> = ({ products }) => {

  const { data: thisSession } = useSession();
  const session: any = thisSession;
  const { enqueueSnackbar } = useSnackbar();
  const { setIsLoading } = useContext( ScrollContext );
  
  const revalidate = async () => {
    if ( process.env.NODE_ENV !== 'production' ) return;

    const resRev = await mprRevalidatePage('/tienda');

    enqueueSnackbar(resRev.message, { variant: !resRev.error ? 'success' : 'error' });
  }
  
  const [formTags, setFormTags] = useState({
    tags: 'todos',
    discount: 0,
  });

  const [formSlug, setFormSlug] = useState({
    slug: '',
    discount: 0,
  });

  const handleDiscount = async ( form: 'tags' | 'slug' ) => {
    setIsLoading( true );
    
    const res = await dbProducts.discountProducts( form, form === 'tags' ? formTags.discount : formSlug.discount, form === 'tags' ? formTags.tags : formSlug.slug );
    
    enqueueSnackbar(res.message, { variant: !res.error ? 'success' : 'error' });
    
    if ( !res.error ) {
      if ( process.env.NODE_ENV === 'production' ) {
        const revRes = await mprRevalidatePage( '/tienda' );
        enqueueSnackbar(revRes.message || 'Error revalidando tienda', { variant: !revRes.error ? 'info' : 'error' });
        
        if ( form === 'slug' ) {
          const revRes2 = await mprRevalidatePage( '/tienda' + formSlug.slug.startsWith('/') ? formSlug.slug : `/${ formSlug.slug }` );
          enqueueSnackbar(revRes2.message || 'Error revalidando el producto', { variant: !revRes2.error ? 'info' : 'error' });
          setIsLoading( false );
          return;
        }
        
        if ( formTags.tags === 'todos' ) {
          const slugsToRevalidate = products.map(p => p.slug);
          slugsToRevalidate.forEach(s => mprRevalidatePage( '/tienda' + s.startsWith('/') ? s : `/${ s }` ));
        } else {
          const slugsToRevalidate = products.filter(p => p.tags.includes(formTags.tags as Tags)).map(p => p.slug);
          slugsToRevalidate.forEach(s => mprRevalidatePage( '/tienda' + s.startsWith('/') ? s : `/${ s }` ));
        }
        
        setIsLoading( false );
        return;
      }
    }
    
  }
 
  return (
    <ShopLayout title={ 'Tienda Virtual' } pageDescription={ 'Tienda virtual oficial de nuestra fundación MPR. Aquí encontrarás todo tipo de artículos para tu mejor amig@ y mascota.' } titleIcon={ <ShoppingBag color='info' sx={{ fontSize: '1.5rem' }} /> } nextPage={ '/' } main>
        
        <ContainerFavProduct products={ products.sort((a, b) => b.sold - a.sold).slice(0, 4) } />

        <Typography>¡Bienvenido a nuestra tienda online!</Typography>

        <Typography>Aquí podrás encontrar todo tipo de artículos para los más consentidos de la casa.</Typography>

        <Typography>Explora todos nuestros productos o usa nuestro buscador para encontrar uno en particular.</Typography>

        <>
          {
            TagsArray.map((tag: Tags) => <ContainerProductType key={ tag } type={ tag } products={ products.filter(p => p.tags.includes( tag )) } more />)
          }
        </>

        <>
        { session && session.user && ( session.user.role === 'superuser' || session.user.role === 'admin' ) &&
          <Box display='flex' flexDirection='column' gap='1rem' sx={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '1.2rem', border: '2px solid #eaeaea' }}>
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
          </Box>
        }
        </>

      <Button variant='contained' onClick={ revalidate }>Revalidar esta página</Button>
        
    </ShopLayout>
  )
}

export const getStaticProps: GetStaticProps = async ( ctx ) => {

    const products = await dbProducts.getAllProducts();

    if ( !products )
        throw new Error('Ocurrió un error obteniendo los productos de la DB');

    return {
      props: {
        products,
      },
      revalidate: 86400, // cada 24h
    }
}

export default TiendaPage;