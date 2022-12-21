import { useContext, lazy, Suspense, memo } from 'react';
import { NextPage, GetStaticProps } from 'next';
import { Box, Typography } from '@mui/material';
import { ShoppingBag } from '@mui/icons-material';
import { isMonday, isToday } from 'date-fns';

import { dbProducts, dbSolds } from '../../database';
import { ShopLayout, ContainerProductType, ContainerFavProduct } from '../../components';
import { IProduct, Tags, TagsArray } from '../../interfaces';
import { AuthContext } from '../../context';

const DiscountForm = lazy(() =>
  import('../../components/shop/DiscountForm')
    .then(({ DiscountForm }) => ({ default: DiscountForm }))
);

const ModalFull = lazy(() =>
  import('../../components/ui/ModalFull')
    .then(({ ModalFull }) => ({ default: ModalFull }))
);

interface Props {
  products: IProduct[];
  mostSoldProducts: IProduct[];
  dolar: number;
}

const TiendaPage: NextPage<Props> = ({ products, mostSoldProducts, dolar }) => {

  const { user: session } = useContext( AuthContext );
  
  return (
    <ShopLayout title={ 'Tienda Virtual' } pageDescription={ 'Tienda virtual oficial de nuestra fundación MPR. Aquí encontrarás todo tipo de artículos para tu mejor amig@ y mascota.' } titleIcon={ <ShoppingBag color='info' sx={{ fontSize: '1.5rem' }} /> } nextPage={ '/' }>
        
        <Suspense fallback={ <></> }>
          <ModalFull products={ products } />
        </Suspense>

        <Box display='flex' sx={{ mb: 1 }}>
          <Typography sx={{ fontSize: '1.2rem', fontWeight: '500', padding: '.4rem 1rem .5rem', borderRadius: '.3rem', color: '#fbfbfb', backgroundColor: 'var(--secondary-color-2)', position: 'relative', boxShadow: '-.4rem .4rem .6rem -.5rem #444' }}>La tasa de hoy es Bs. { dolar } x 1$</Typography>
        </Box>
        
        <ContainerFavProduct products={ mostSoldProducts } />

        <Typography>¡Bienvenido a nuestra tienda online!</Typography>

        <Typography>Aquí podrás encontrar todo tipo de artículos para los más consentidos de la casa.</Typography>

        <Typography>Explora todos nuestros productos o usa nuestro buscador para encontrar uno en particular.</Typography>

        <>
          {
            TagsArray.map((tag: Tags) => <ContainerProductType key={ tag } type={ tag } products={ products.filter(p => p.tags.includes( tag )) } />)
          }
        </>

        <>
          { session && ( session.role === 'superuser' || session.role === 'admin' ) &&
            <Suspense fallback={ <Typography>Cargando...</Typography> }>
              <DiscountForm />
            </Suspense>
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
      revalidate: 3600 * 12, // cada 8h
    }
}

export default TiendaPage;