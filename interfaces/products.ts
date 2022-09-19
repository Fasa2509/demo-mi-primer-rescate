import { ImageObj } from './articles'
import { ISize } from './';

export interface IProduct {
  
    _id: string;
    name: string;
    description: string;
    images: ImageObj[];
    inStock: number;
    price: number;
    discount?: number | undefined;
    tags: Tags[];
    slug: string;
  
}

export type Tags = 'juguetes' | 'comida' | 'ropa' | 'medicamentos' | 'servicios';

export const initialFavProducts: IProduct[] = [
    {
      _id: 'abcd1',
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
          width: 300,
          height: 300,
        },
        {
          url: '/perro-2.webp',
          alt: 'Perro 2',
          width: 250,
          height: 250,
        },
      ],
      name: 'Capucha perro grande',
      description: 'Hermosa capucha para perros grandes con forma de oso',
      price: 5,
      discount: 4,
      inStock: 17,
      tags: ['ropa'],
      slug: '/capucha_perro_grande',
    },
    {
      _id: 'abcd2',
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
          width: 300,
          height: 300,
        },
        {
          url: '/perro-2.webp',
          alt: 'Perro 2',
          width: 250,
          height: 250,
        },
      ],
      name: 'Recipiente (estrellado)',
      description: 'Recipiente estrellado para agua o comida',
      price: 7,
      inStock: 23,
      tags: ['comida'],
      slug: '/recipiente_estrellado',
    },
    {
      _id: 'abcd3',
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
          width: 300,
          height: 300,
        },
        {
          url: '/perro-2.webp',
          alt: 'Perro 2',
          width: 250,
          height: 250,
        },
      ],
      name: 'Saco de perrarina XXXXX (20Kg)',
      description: 'Saco de 20Kg de perrarina marca XXXXX para perros pequeños y medianos',
      price: 16,
      inStock: 12,
      tags: ['comida'],
      slug: '/perrarina_XXXXX_20kg',
    },
    {
      _id: 'abcd4',
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
          width: 300,
          height: 300,
        },
        {
          url: '/perro-2.webp',
          alt: 'Perro 2',
          width: 250,
          height: 250,
        },
      ],
      name: 'Vitamina YYY',
      description: 'Vitamina YYY para reforzar las defensas de tu mascota y embellecer su pelaje',
      price: 12,
      discount: 10,
      inStock: 7,
      tags: ['medicamentos'],
      slug: '/vitamina_YYY'  
    },
]
  
export const initialProducts: IProduct[] = [
    {
      _id: 'abcd5',
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
          width: 300,
          height: 300,
        },
        {
          url: '/perro-2.webp',
          alt: 'Perro 2',
          width: 300,
          height: 300,
        },
      ],
      name: 'Ex est laboris ullamco',
      description: 'Et duis.',
      price: 3,
      discount: 2,
      inStock: 30,
      tags: ['comida', 'medicamentos'],
      slug: '/producto_1',
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
          width: 300,
          height: 300,
        },
        {
          url: '/perro-2.webp',
          alt: 'Perro 2',
          width: 250,
          height: 250,
        },
      ],
      name: 'Ex est laboris ullamco tipce',
      description: 'Et duis  occaecat. Ipsum sit velit reprehenderit irure Lorem cillum nisi aliqua reprehenderit do anim laborum cupidatat. Aliqua nulla Lorem magna ut sit pariatur ex consectetur nostrud.',
      price: 20,
      inStock: 27,
      tags: ['juguetes', 'ropa'],
      slug: '/producto_2',
    },
    {
      _id: 'abcd7',
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
          width: 300,
          height: 300,
        },
        {
          url: '/perro-2.webp',
          alt: 'Perro 2',
          width: 250,
          height: 250,
        },
      ],
      name: 'Ex est laboris',
      description: 'Laboris minim reprehenderit amet excepteur voluptate. Non amet fugiat',
      price: 15,
      inStock: 34,
      tags: ['juguetes', 'comida'],
      slug: '/producto_3',
    },
    {
      _id: 'abcd8',
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
          width: 300,
          height: 300,
        },
        {
          url: '/perro-2.webp',
          alt: 'Perro 2',
          width: 250,
          height: 250,
        },
      ],
      name: 'Simte lup laboris ullamco',
      description: 'Non amet fugiat. Voluptate magna minim mollit',
      price: 8,
      inStock: 45,
      tags: ['servicios'],
      slug: '/producto_4',
    },
    {
      _id: 'abcd9',
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
          width: 300,
          height: 300,
        },
        {
          url: '/perro-2.webp',
          alt: 'Perro 2',
          width: 250,
          height: 250,
        },
      ],
      name: 'Tomos elec ullamco',
      description: 'Et  occaecat veniam minim reprehenderit amet excepteur voluptate',
      price: 2,
      discount: 1.5,
      inStock: 24,
      tags: ['servicios'],
      slug: '/producto_5',
    },
]

export const allProducts = [...initialFavProducts, ...initialProducts]