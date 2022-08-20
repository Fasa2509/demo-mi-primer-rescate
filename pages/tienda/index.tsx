import { NextPage } from 'next'

import { ShopLayout, ContainerProductType, ContainerFavProduct } from '../../components'
import { IProduct } from '../../interfaces'
import styles from '../../styles/Tienda.module.css'

const initialFavProducts: IProduct[] = [
  {
    image: '/square-dog.jpg',
    name: 'Capucha perro grande',
    description: 'Hermosa capucha para perros grandes con forma de oso',
    price: 5,
    discount: 4,
    stock: 17,
    tags: ['ropa'],
    slug: 'capucha_perro_grande',
  },
  {
    image: '/square-dog.jpg',
    name: 'Recipiente (estrellado)',
    description: 'Recipiente estrellado para agua o comida',
    price: 7,
    stock: 23,
    tags: ['comida'],
    slug: 'recipiente_estrellado',
  },
  {
    image: '/square-dog.jpg',
    name: 'Saco de perrarina XXXXX (20Kg)',
    description: 'Saco de 20Kg de perrarina marca XXXXX para perros pequeños y medianos',
    price: 16,
    stock: 12,
    tags: ['comida'],
    slug: 'perrarina_XXXXX_20kg',
  },
  {
    image: '/square-dog.jpg',
    name: 'Vitamina YYY',
    description: 'Vitamina YYY para reforzar las defensas de tu mascota y embellecer su pelaje',
    price: 12,
    discount: 10,
    stock: 7,
    tags: ['medicamentos'],
    slug: 'vitamina_YYY'  
  },
]

const initialProducts: IProduct[] = [
  {
    image: '/square-dog.jpg',
    name: 'Ex est laboris ullamco',
    description: 'Et duis.',
    price: 3,
    discount: 2,
    stock: 30,
    tags: ['comida', 'medicamentos'],
    slug: 'producto_1',
  },
  {
    image: '/square-dog.jpg',
    name: 'Ex est laboris ullamco tipce',
    description: 'Et duis  occaecat. Ipsum sit velit reprehenderit irure Lorem cillum nisi aliqua reprehenderit do anim laborum cupidatat. Aliqua nulla Lorem magna ut sit pariatur ex consectetur nostrud. Commodo proident adipisicing reprehenderit qui magna reprehenderit ad cillum labore qui Laboris reprehenderit amet excepteur. Non amet fugiat. Voluptate magna minim mollit',
    price: 20,
    stock: 27,
    tags: ['juguetes', 'ropa'],
    slug: 'producto_2',
  },
  {
    image: '/square-dog.jpg',
    name: 'Ex est laboris',
    description: 'Laboris minim reprehenderit amet excepteur voluptate. Non amet fugiat',
    price: 15,
    stock: 34,
    tags: ['juguetes', 'comida'],
    slug: 'producto_3',
  },
  {
    image: '/square-dog.jpg',
    name: 'Simte lup laboris ullamco',
    description: 'Non amet fugiat. Voluptate magna minim mollit',
    price: 8,
    stock: 45,
    tags: ['servicios'],
    slug: 'producto_4',
  },
  {
    image: '/square-dog.jpg',
    name: 'Tomos elec ullamco',
    description: 'Et  occaecat veniam minim reprehenderit amet excepteur voluptate',
    price: 2,
    discount: 1.5,
    stock: 24,
    tags: ['servicios'],
    slug: 'producto_5',
  },
]

const TiendaPage: NextPage = () => {
 
  return (
    <ShopLayout title={ 'Tienda Virtual' } pageDescription={ 'Tienda virtual oficial de nuestra fundación MPR. Aquí encontrarás todo tipo de artículos para tu mejor amig@ y mascota.' }>
        
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