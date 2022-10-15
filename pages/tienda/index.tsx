import { NextPage, GetStaticProps } from 'next';
import { ShoppingBag } from '@mui/icons-material'
import { Typography } from '@mui/material'

import { dbProducts } from '../../database';
import { ShopLayout, ContainerProductType, ContainerFavProduct } from '../../components'
import { IProduct, Tags, TagsArray } from '../../interfaces'
import styles from '../../styles/Tienda.module.css'

interface Props {
  products: IProduct[];
}

const TiendaPage: NextPage<Props> = ({ products }) => {
 
  return (
    <ShopLayout title={ 'Tienda Virtual' } pageDescription={ 'Tienda virtual oficial de nuestra fundación MPR. Aquí encontrarás todo tipo de artículos para tu mejor amig@ y mascota.' } titleIcon={ <ShoppingBag color='info' sx={{ fontSize: '1.5rem' }} /> } nextPage={ '/' } main>
        
        <ContainerFavProduct products={ products.sort((a, b) => b.sold - a.sold).slice(0, 6) } />

        <Typography>¡Bienvenido a nuestra tienda online!</Typography>

        <Typography>Aquí podrás encontrar todo tipo de artículos para los más consentidos de la casa.</Typography>

        <Typography>Explora todos nuestros productos o usa nuestro buscador para encontrar uno en particular.</Typography>

        <>
          {
            TagsArray.map((tag: Tags) => <ContainerProductType key={ tag } type={ tag } products={ products.filter(p => p.tags.includes( tag )) } more />)
          }
        </>
        
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