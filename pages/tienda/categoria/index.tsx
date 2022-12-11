import { useContext, useEffect, useState, useMemo } from "react";
import { NextPage, GetStaticProps } from 'next';
import { useRouter } from "next/router";
import NextLink from "next/link";
import { Box, Button, Typography } from "@mui/material";
import { ShoppingBag } from "@mui/icons-material";
import { useSnackbar } from "notistack";

import { dbProducts } from "../../../database";
import { mprRevalidatePage } from "../../../mprApi";
import { AuthContext, ScrollContext } from '../../../context';
import { ContainerProductCategory, ModalFull, ShopLayout } from "../../../components";
import { formatText } from "../../../utils";
import { IProduct, Tags, TagsArray } from "../../../interfaces";

interface Props {
    products: IProduct[];
}

type CategoryKey = 'útil' | 'consumibles' | 'ropa' | 'accesorios';

const TypePage: NextPage<Props> = ({ products }) => {

    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const { user } = useContext( AuthContext );
    const { setIsLoading } = useContext( ScrollContext );
    const [productType, setProductType] = useState<Tags>('accesorios');

    useEffect(() => {
        if ( !router.query.tipo || !TagsArray.includes( router.query.tipo.toString() as Tags ) ) {
            router.push(router.pathname + '?tipo=accesorios', undefined, { shallow: true });
            return;
        }
        setProductType( router.query.tipo.toString() as Tags );
    }, [ router ]);

    const util = useMemo(() => products.filter(( p ) => p.tags.includes( 'útil' )), [products]);
    const accesorios = useMemo(() => products.filter(( p ) => p.tags.includes( 'accesorios' )), [products]);
    const ropa = useMemo(() => products.filter(( p ) => p.tags.includes( 'ropa' )), [products]);
    const consumibles = useMemo(() => products.filter(( p ) => p.tags.includes( 'consumibles' )), [products]);

    const cats: { útil: IProduct[]; accesorios: IProduct[]; ropa: IProduct[]; consumibles: IProduct[] } = useMemo(() => ({
        útil: util,
        accesorios,
        ropa,
        consumibles,
    }), [util, accesorios, ropa, consumibles]);

    const revalidate = async () => {
        if ( process.env.NODE_ENV !== 'production' ) return;
    
        setIsLoading( true );
        const resRev = await mprRevalidatePage('/tienda/categoria');
        setIsLoading( false );
    
        enqueueSnackbar(resRev.message, { variant: !resRev.error ? 'success' : 'error' });
    }

  return (
    <ShopLayout title={ 'Tienda Virtual' } H1={ 'Tienda' } pageDescription={ 'Tienda virtual oficial de nuestra fundación MPR. Aquí encontrarás todo tipo de artículos para tu mejor amig@ y mascota.' } titleIcon={ <ShoppingBag color='info' sx={{ fontSize: '1.5rem' }} /> } nextPage={ '/tienda' }>

        <ModalFull products={ products } />

        <Typography>¿Buscas un tipo de producto en particular? Aquí lo encontrarás.</Typography>
        <Typography>Filtra tus productos por categoría.</Typography>

        <Box className='fadeIn' display='flex' justifyContent='space-evenly' sx={{ my: 2 }}>
            {
                TagsArray.map(tag => <NextLink key={ tag } href={ `/tienda/categoria?tipo=${ tag }` } shallow><Button color='secondary' sx={{ fontSize: '.9rem' }}>{ formatText( tag ) }</Button></NextLink>)
            }
        </Box>

        <ContainerProductCategory type={ productType } products={ cats[router.query.tipo as CategoryKey || 'accesorios'] } />
        
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
            products,
        },
        revalidate: 86400, // cada 24h
    }
}

export default TypePage;