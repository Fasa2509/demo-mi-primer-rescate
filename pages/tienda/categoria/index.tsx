import { useEffect, useMemo, useState } from "react";
import { NextPage, GetStaticProps } from 'next';
import { useRouter } from "next/router";
import NextLink from "next/link";
import { Box, Button, Typography } from "@mui/material";
import { ShoppingBag } from "@mui/icons-material";

import { dbProducts } from "../../../database";
import { ContainerProductType, ShopLayout } from "../../../components";
import { formatText } from "../../../utils";
import { IProduct, Tags, TagsArray } from "../../../interfaces";

interface Props {
    products: IProduct[];
}

const TypePage: NextPage<Props> = ({ products }) => {

    const router = useRouter();
    const [productType, setProductType] = useState<Tags>('accesorios');
    
    useEffect(() => {
        if ( Object.keys( router.query ).length > 0 && Object.keys( router.query )[0] !== 'tipo' ) router.push('/tienda');
        if ( Object.keys( router.query ).length > 1 ) router.push('/tienda');
    }, [ router ])

    useEffect(() => {
        if ( !router.query.tipo || !TagsArray.includes( router.query.tipo.toString() as Tags ) ) return;
        setProductType( router.query.tipo.toString() as Tags )
    }, [ router.query ])

    const consumibles = useMemo(() => products.filter(p => p.tags.includes('consumibles')), [products]);
    const accesorios = useMemo(() => products.filter(p => p.tags.includes('accesorios')), [products]);
    const ropa = useMemo(() => products.filter(p => p.tags.includes('ropa')), [products]);
    const util = useMemo(() => products.filter(p => p.tags.includes('útil')), [products]);

  return (
    <ShopLayout title={ 'Tienda Virtual' } H1={ 'Tienda' } pageDescription={ 'Tienda virtual oficial de nuestra fundación MPR. Aquí encontrarás todo tipo de artículos para tu mejor amig@ y mascota.' } titleIcon={ <ShoppingBag color='info' sx={{ fontSize: '1.5rem' }} /> } nextPage={ '/tienda' }>

        <Typography>¿Buscas un tipo de producto en particular? Aquí lo encontrarás</Typography>

        <Box className='fadeIn' display='flex' justifyContent='space-evenly' sx={{ my: 2 }}>
            {
                TagsArray.map(tag => <NextLink key={ tag } href={ `/tienda/categoria?tipo=${ tag }` }><Button variant='outlined' color='secondary' sx={{ fontSize: '.9rem' }}>{ formatText( tag ) }</Button></NextLink>)
            }
        </Box>

        {/* {
            (router.query.tipo && router.query.tipo === 'consumibles')
            ? <ContainerProductType className='fadeIn' type="Consumibles" products={ consumibles } />
            : <></>    
        }

        {
            (router.query.tipo && router.query.tipo === 'accesorios')
            ? <ContainerProductType className='fadeIn' type="Accesorios" products={ accesorios } />
            : <></>    
        }

        {
            (router.query.tipo && router.query.tipo === 'ropa')
            ? <ContainerProductType className='fadeIn' type="Ropa" products={ ropa } />
            : <></>    
        }

        {
            (router.query.tipo && router.query.tipo === 'útil')
            ? <ContainerProductType className='fadeIn' type="Útil" products={ util } />
            : <></>    
        } */}

        <ContainerProductType type={ productType } products={ products.filter(p => p.tags.includes( productType )) } />

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