import { useContext, useEffect, useState, useMemo, lazy, Suspense } from "react";
import { NextPage, GetStaticProps } from 'next';
import { useRouter } from "next/router";
import NextLink from "next/link";
import { Box, Button, Typography } from "@mui/material";
import ShoppingBag from "@mui/icons-material/ShoppingBag";
import { useSnackbar } from "notistack";

import { dbProducts } from "../../../database";
import { mprRevalidatePage } from "../../../mprApi";
import { AuthContext, ScrollContext } from '../../../context';
import { ContainerProductCategory, ShopLayout } from "../../../components";
import { formatText } from "../../../utils";
import { IProduct, Tags, TagsArray } from "../../../interfaces";

const ModalFull = lazy(() =>
  import('../../../components/ui/ModalFull')
    .then(({ ModalFull }) => ({ default: ModalFull }))
);

interface Props {
    products: IProduct[];
}

type CategoryKey = 'útil' | 'consumibles' | 'ropa' | 'accesorios';

const TypePage: NextPage<Props> = ({ products }) => {

    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const { user } = useContext( AuthContext );
    const { setIsLoading } = useContext( ScrollContext );
    const [productType, setProductType] = useState<Tags>('-' as Tags);
    const [didMount, setDidMount] = useState( false );

    useEffect(() => setDidMount( true ), []);

    useEffect(() => {
        if ( !didMount ) return;
        router.query.tipo && setProductType( router.query.tipo.toString() as Tags );
    }, [ router, didMount ]);

    const útil = useMemo(() => products.filter(( p ) => p.tags.includes( 'útil' )), [products]);
    const accesorios = useMemo(() => products.filter(( p ) => p.tags.includes( 'accesorios' )), [products]);
    const ropa = useMemo(() => products.filter(( p ) => p.tags.includes( 'ropa' )), [products]);
    const consumibles = useMemo(() => products.filter(( p ) => p.tags.includes( 'consumibles' )), [products]);

    const cats: { útil: IProduct[]; accesorios: IProduct[]; ropa: IProduct[]; consumibles: IProduct[] } = useMemo(() => ({
        útil,
        accesorios,
        ropa,
        consumibles,
    }), [útil, accesorios, ropa, consumibles]);

    const revalidate = async () => {
        if ( process.env.NODE_ENV !== 'production' ) return;
    
        setIsLoading( true );
        const resRev = await mprRevalidatePage('/tienda/categoria');
        setIsLoading( false );
    
        enqueueSnackbar(resRev.message, { variant: !resRev.error ? 'success' : 'error' });
    }

  return (
    <ShopLayout title={ 'Tienda Virtual' } H1={ 'Tienda' } pageDescription={ 'Tienda virtual oficial la fundación Mi Primer Rescate. Encuentra productos por categoría para tu mascota.' } titleIcon={ <ShoppingBag color='info' sx={{ fontSize: '1.5rem' }} /> } nextPage='/tienda' url='/tienda/categoria'>

        <Suspense fallback={ <Typography>Cargando...</Typography> }>
            <ModalFull products={ products } />
        </Suspense>

        <Typography>¿Buscas un tipo de producto en particular? Aquí lo encontrarás.</Typography>
        <Typography>Filtra tus productos por categoría.</Typography>

        <Box className='fadeIn' display='flex' justifyContent='space-evenly' sx={{ my: 2 }}>
            {
                TagsArray.map(tag => <NextLink key={ tag } href={ `/tienda/categoria?tipo=${ tag }` } rel='nofollow' shallow><Button className='button low--padding' color='secondary' sx={{ fontSize: '.9rem' }}>{ formatText( tag ) }</Button></NextLink>)
            }
        </Box>

        <ContainerProductCategory type={ productType } products={ cats[router.query.tipo as CategoryKey] || [] } />

        <>
          { user && ( user.role === 'admin' || user.role === 'superuser' ) &&
            <Button className='fadeIn' variant='contained' color='secondary' sx={{ mt: 2 }} onClick={ revalidate }>Revalidar esta página</Button>
          }
        </>

    </ShopLayout>
  )
}

export const getStaticProps: GetStaticProps = async ( ctx ) => {

    const products = await dbProducts.getAllProducts();

    if ( !products ) throw new Error('Ocurrió un error trayendo los productos de la DB (CategoriaPage)');

    return {
        props: {
            products: products.reverse(),
        },
        revalidate: 3600 * 12, // cada 24h
    }
}

export default TypePage;