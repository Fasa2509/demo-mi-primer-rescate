import { NextPage } from 'next'
import { ShoppingBag } from '@mui/icons-material'

import { ShopLayout, ContainerProductType, ContainerFavProduct } from '../../components'
import { initialFavProducts, initialProducts } from '../../interfaces'
import styles from '../../styles/Tienda.module.css'

const TiendaPage: NextPage = () => {
 
  return (
    <ShopLayout title={ 'Tienda Virtual' } pageDescription={ 'Tienda virtual oficial de nuestra fundación MPR. Aquí encontrarás todo tipo de artículos para tu mejor amig@ y mascota.' } titleIcon={ <ShoppingBag color='info' sx={{ fontSize: '1.5rem' }} /> } nextPage={ '/' }>
        
        <p>¡Bienvenido a nuestra tienda online!</p>

        <p>Aquí podrás encontrar todo tipo de artículos para los más consentidos de la casa.</p>

        <p>Explora todos nuestros productos o usa nuestro buscador para encontrar uno en particular.</p>

        <ContainerFavProduct initialFavProducts={ initialFavProducts } />

        <ContainerProductType type='Juguetes' initialProducts={ initialProducts } />

        <ContainerProductType type='Comida' initialProducts={ initialProducts } />
        
        <ContainerProductType type='Ropa' initialProducts={ initialProducts } />
        
        <ContainerProductType type='Medicamentos' initialProducts={ initialProducts } />
        
        <ContainerProductType type='Servicios' initialProducts={ initialProducts } />

    </ShopLayout>
  )
}

export default TiendaPage;