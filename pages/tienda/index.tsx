import { useContext, lazy, Suspense } from 'react';
import { NextPage, GetStaticProps } from 'next';
import { Box, Typography } from '@mui/material';
import ShoppingBag from '@mui/icons-material/ShoppingBag';
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

  const { user } = useContext(AuthContext);

  return (
    <ShopLayout title={'Tienda Virtual'} pageDescription={'Tienda virtual oficial de nuestra fundación MPR. Aquí encontrarás todo tipo de artículos como alimentos y ropa para ti y tu mejor amig@ y mascota. ¡No pierdas el tiempo!'} titleIcon={<ShoppingBag color='info' sx={{ fontSize: '1.5rem' }} />} nextPage='/' url='/tienda'>

      <Suspense fallback={<></>}>
        <ModalFull products={products} />
      </Suspense>

      <Box display='flex' sx={{ mb: 1 }}>
        <Typography sx={{ fontSize: '1.2rem', fontWeight: '500', padding: '.4rem 1rem .5rem', borderRadius: '.3rem', color: '#fbfbfb', backgroundColor: 'var(--secondary-color-2)', position: 'relative', boxShadow: '-.4rem .4rem .6rem -.5rem #444' }}>La tasa de hoy es Bs. {dolar} x 1$</Typography>
      </Box>

      <ContainerFavProduct products={mostSoldProducts} />

      <section className='content-island'>
        <Typography>¡Bienvenid@ a nuestra tienda online!</Typography>
        <Typography>Aquí podrás encontrar todo tipo de artículos para los más consentidos de la casa.</Typography>
        <Typography>Explora todos nuestros productos o usa nuestro buscador para encontrar uno en particular.</Typography>
      </section>

      <>
        {
          TagsArray.map((tag: Tags) => <ContainerProductType key={tag} type={tag} products={products.filter(p => p.tags.includes(tag))} />)
        }
      </>

      <>
        {user && (user.role === 'admin' || user.role === 'superuser') &&
          <Suspense fallback={<Typography>Cargando...</Typography>}>
            <DiscountForm />
          </Suspense>
        }
      </>

    </ShopLayout>
  )
}

export const getStaticProps: GetStaticProps = async (ctx) => {

  const dolar = (await dbProducts.backGetDolarPrice()) ?? 10;

  if (!dolar)
    throw new Error('Ocurrió un error obteniendo el valor del dólar de la DB');

  let products = (await dbProducts.getAllProducts());

  if (!products) products = [
    {
      _id: 'abcd5',
      images: [
        {
          url: '/perro-1.webp',
          alt: 'Perro 1',
          width: 500,
          height: 500,
        },
        {
          url: '/perro-2.webp',
          alt: 'Perro 2',
          width: 500,
          height: 500,
        },
      ],
      name: 'Ex est laboris ullamco',
      description: 'Et duis.',
      price: 3,
      discount: 0.1,
      inStock: {
        unique: 24
      },
      tags: ['consumibles', 'accesorios', 'útil'],
      sold: 0,
      slug: 'producto_1',
      isAble: true,
      createdAt: (() => Date.now())()
    },
    {
      _id: 'abcd6',
      images: [
        {
          url: '/square-dog.jpg',
          alt: 'Perro cuadrado',
          width: 500,
          height: 500,
        },
        {
          url: '/perro-1.webp',
          alt: 'Perro 1',
          width: 500,
          height: 500,
        },
        {
          url: '/perro-2.webp',
          alt: 'Perro 2',
          width: 500,
          height: 500,
        },
        {
          url: '/Logo-Redes.png',
          alt: 'Perro 2',
          width: 500,
          height: 500,
        },
      ],
      name: 'Ex est laboris ullamco tipce',
      description: 'Et duis  occaecat. Ipsum sit velit reprehenderit irure Lorem cillum nisi aliqua reprehenderit do anim laborum cupidatat. Aliqua nulla Lorem magna ut sit pariatur ex consectetur nostrud.',
      price: 20,
      discount: 0,
      inStock: {
        unique: -1,
        S: 10,
        L: 50,
        XL: 12,
      },
      tags: ['ropa', 'útil'],
      sold: 0,
      slug: 'producto_2',
      isAble: true,
      createdAt: (() => Date.now())()
    },
    {
      _id: 'abcd7',
      images: [
        {
          url: '/Logo-Redes.png',
          alt: 'Perro 2',
          width: 500,
          height: 500,
        },
        {
          url: '/perro-1.webp',
          alt: 'Perro 1',
          width: 500,
          height: 500,
        },
        {
          url: '/perro-2.webp',
          alt: 'Perro 2',
          width: 500,
          height: 500,
        },
        {
          url: '/Logo-MPR.png',
          alt: 'Perro 2',
          width: 500,
          height: 500,
        },
      ],
      name: 'Ex est laboris',
      description: 'Laboris minim reprehenderit amet excepteur voluptate. Non amet fugiat',
      price: 15,
      discount: 0,
      inStock: {
        unique: 4
      },
      tags: ['accesorios'],
      sold: 0,
      slug: 'producto_3',
      isAble: true,
      createdAt: (() => Date.now())()
    },
    {
      _id: 'abcd8',
      images: [
        {
          url: '/Logo-MPR.png',
          alt: 'Perro 2',
          width: 500,
          height: 500,
        },
        {
          url: '/perro-1.webp',
          alt: 'Perro 1',
          width: 500,
          height: 500,
        },
        {
          url: '/perro-2.webp',
          alt: 'Perro 2',
          width: 500,
          height: 500,
        },
      ],
      name: 'Gorra o Chapa',
      description: 'Non amet fugiat. Voluptate magna minim mollit',
      price: 8,
      discount: 0,
      inStock: {
        unique: -1,
        S: 4,
        M: 5,
        L: 6,
      },
      tags: ['ropa'],
      sold: 0,
      slug: 'gorra_o_chapa',
      isAble: true,
      createdAt: (() => Date.now())()
    },
    {
      _id: 'abcd9',
      images: [
        {
          url: '/gato-2.jpg',
          alt: 'Perro cuadrado',
          width: 500,
          height: 500,
        },
        {
          url: '/square-dog.jpg',
          alt: 'Perro cuadrado',
          width: 500,
          height: 500,
        },
        {
          url: '/perro-2.webp',
          alt: 'Perro 2',
          width: 500,
          height: 500,
        },
      ],
      name: 'Tomos elec ullamco',
      description: 'Et  occaecat veniam minim reprehenderit amet excepteur voluptate',
      price: 2,
      discount: 0.5,
      inStock: {
        unique: -1,
        S: 0,
        M: 1,
        L: 2,
        XL: 3,
        XXL: 4,
        XXXL: 5,
      },
      tags: ['ropa'],
      sold: 0,
      slug: 'producto_5',
      isAble: true,
      createdAt: (() => Date.now())()
    },
  ]

  if (!products)
    throw new Error('Ocurrió un error obteniendo los productos de la DB');

  const solds = (await dbSolds.getSoldProducts()) ?? [];

  if (!solds)
    throw new Error('Ocurrió un error obteniendo los productos vendidos de la DB');

  const mostSoldProducts = products.map((product) => {
    const soldProduct = solds.find((sold) => sold.productId.toString() === product._id.toString()) || { soldUnits: 0 };

    return {
      ...product,
      sold: product.sold - soldProduct.soldUnits,
    }
  }).sort((a: IProduct, b: IProduct) => b.sold - a.sold).slice(0, 4);

  if (isMonday((() => Date.now())())) {
    // @ts-ignore
    const notAllUpdatedToday = solds.filter(s => !isToday(s.updatedAt)).length > 0;

    if (notAllUpdatedToday) {
      const updatedAt = (() => Date.now())();
      const updatedSoldProducts = products.map((product) => ({ _id: '', productId: product._id, soldUnits: product.sold, updatedAt }));

      const res = await dbSolds.updateSoldProducts(updatedSoldProducts);
    }
  }

  return {
    props: {
      mostSoldProducts: [
        {
          _id: 'abcd1',
          images: [
            {
              url: '/perro-1.webp',
              alt: 'Perro 1',
              width: 500,
              height: 500,
            },
            {
              url: '/square-dog.jpg',
              alt: 'Perro cuadrado',
              width: 500,
              height: 500,
            },
            {
              url: '/perro-2.webp',
              alt: 'Perro 2',
              width: 500,
              height: 500,
            },
          ],
          name: 'Capucha perro grande',
          description: 'Hermosa capucha para perros grandes con forma de oso',
          price: 5,
          discount: 0.1,
          inStock: {
            unique: 7
          },
          tags: ['accesorios', 'útil'],
          sold: 0,
          slug: 'capucha_perro_grande',
          isAble: true,
          createdAt: (() => Date.now())()
        },
        {
          _id: 'abcd2',
          images: [
            {
              url: '/perro-2.webp',
              alt: 'Perro 2',
              width: 500,
              height: 500,
            },
            {
              url: '/square-dog.jpg',
              alt: 'Perro cuadrado',
              width: 500,
              height: 500,
            },
            {
              url: '/perro-1.webp',
              alt: 'Perro 1',
              width: 500,
              height: 500,
            },
          ],
          name: 'Recipiente (estrellado)',
          description: 'Recipiente estrellado para agua o consumibles',
          price: 7,
          discount: 0,
          inStock: {
            unique: 6
          },
          tags: ['útil'],
          sold: 0,
          slug: 'recipiente_estrellado',
          isAble: true,
          createdAt: (() => Date.now())()
        },
        {
          _id: 'abcd3',
          images: [
            {
              url: '/gato-2.jpg',
              alt: 'Perro cuadrado',
              width: 500,
              height: 500,
            },
            {
              url: '/perro-2.webp',
              alt: 'Perro 2',
              width: 500,
              height: 500,
            },
            {
              url: '/perro-1.webp',
              alt: 'Perro 1',
              width: 500,
              height: 500,
            },
            {
              url: '/gato-1.webp',
              alt: 'Perro cuadrado',
              width: 500,
              height: 500,
            },
          ],
          name: 'Saco de perrarina XXXXX (20Kg)',
          description: 'Saco de 20Kg de perrarina marca XXXXX para perros pequeños y medianos',
          price: 16,
          discount: 0,
          inStock: {
            unique: 12
          },
          tags: ['consumibles'],
          sold: 0,
          slug: 'perrarina_xxxxx_20kg',
          isAble: true,
          createdAt: (() => Date.now())()
        },
        {
          _id: 'abcd4',
          images: [
            {
              url: '/gato-1.webp',
              alt: 'Perro cuadrado',
              width: 500,
              height: 500,
            },
            {
              url: '/perro-2.webp',
              alt: 'Perro 2',
              width: 500,
              height: 500,
            },
          ],
          name: 'Vitamina YYY',
          description: 'Vitamina YYY para reforzar las defensas de tu mascota y embellecer su pelaje',
          price: 12,
          discount: 0.2,
          inStock: {
            unique: 15
          },
          tags: ['consumibles'],
          sold: 0,
          slug: 'vitamina_yyy',
          isAble: true,
          createdAt: (() => Date.now())()
        },
      ],
      products: products.sort(() => 0.5 - Math.random()).reverse().sort(() => 0.5 - Math.random()).reverse(),
      dolar,
    },
    revalidate: 3600 * 12 * 2 * 7, // cada 12h
  }
}

export default TiendaPage;