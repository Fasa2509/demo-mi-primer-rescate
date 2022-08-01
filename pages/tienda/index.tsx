import { Star } from '@mui/icons-material'
import { NextPage } from 'next'
import NextLink from 'next/link'

import { BigProductCard, ShopLayout, LongProductCard } from '../../components'
import styles from '../../styles/Tienda.module.css'


const initialFavProducts = [
  {
    image: '/square-dog.jpg',
    name: 'Capucha perro grande',
    price: 5,
    description: 'Hermosa capucha para perros grandes con forma de oso',
  },
  {
    image: '/square-dog.jpg',
    name: 'Recipiente (estrellado)',
    price: 7,
    description: 'Recipiente estrellado para agua o comida',
  },
  {
    image: '/square-dog.jpg',
    name: 'Saco de perrarina XXXXX (20Kg)',
    price: 16,
    description: 'Saco de 20Kg de perrarina marca XXXXX para perros pequeños y medianos',
  },
  {
    image: '/square-dog.jpg',
    name: 'Vitamina YYY',
    price: 12,
    description: 'Vitamina YYY para reforzar las defensas de tu mascota y embellecer su pelaje',
  },
]

const initialProducts = [
  {
    image: '/square-dog.jpg',
    name: 'Ex est laboris ullamco',
    price: 3,
    description: 'Et duis.',
  },
  {
    image: '/square-dog.jpg',
    name: 'Ex est laboris ullamco tipce',
    price: 20,
    description: 'Et duis  occaecat. Ipsum sit velit reprehenderit irure Lorem cillum nisi aliqua reprehenderit do anim laborum cupidatat. Aliqua nulla Lorem magna ut sit pariatur ex consectetur nostrud. Commodo proident adipisicing reprehenderit qui magna reprehenderit ad cillum labore qui Laboris reprehenderit amet excepteur. Non amet fugiat. Voluptate magna minim mollit',
  },
  {
    image: '/square-dog.jpg',
    name: 'Ex est laboris',
    price: 15,
    description: 'Laboris minim reprehenderit amet excepteur voluptate. Non amet fugiat',
  },
  {
    image: '/square-dog.jpg',
    name: 'Simte lup laboris ullamco',
    price: 8,
    description: 'Non amet fugiat. Voluptate magna minim mollit',
  },
  {
    image: '/square-dog.jpg',
    name: 'Tomos elec ullamco',
    price: 2,
    description: 'Et  occaecat veniam minim reprehenderit amet excepteur voluptate',
  },
]


const TiendaPage: NextPage = () => {
  return (
    <ShopLayout title={ 'Tienda virtual' } pageDescription={ 'Tienda virtual oficial de MPR' }>
        
        <p>¡Bienvenido a nuestra tienda online!</p>
        <p>Aquí podrás encontrar todo tipo de artículos para los más consentidos de la casa.</p>

        <section className={ styles.most__requested }>
          <h1>
            Lo más vendido la última semana!
            <Star />
          </h1>
          <div className={ styles.requested__products }>
            {
              initialFavProducts.map( (product, index) => <BigProductCard key={ product.name + index } product={ product } />)
            }
          </div>
        </section>

        <section className={ styles.all__products }>
            <h1>Juguetes</h1>
            {
              initialProducts.map( (product) => <LongProductCard key={ product.name } product={ product } />)
            }
            <NextLink href={ '#' } passHref>
              <a className={ styles.more__products }>Explorar más...</a>
            </NextLink>
        </section>
        
        <section className={ styles.all__products }>
            <h1>Comida</h1>
            {
              initialProducts.map( (product) => <LongProductCard key={ product.name } product={ product } />)
            }
            <NextLink href={ '#' } passHref>
              <a className={ styles.more__products }>Explorar más...</a>
            </NextLink>
        </section>

        <section className={ styles.all__products }>
            <h1>Ropa</h1>
            {
              initialProducts.map( (product) => <LongProductCard key={ product.name } product={ product } />)
            }
            <NextLink href={ '#' } passHref>
              <a className={ styles.more__products }>Explorar más...</a>
            </NextLink>
        </section>

    </ShopLayout>
  )
}

export default TiendaPage;