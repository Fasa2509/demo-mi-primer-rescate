import { ImageObj } from './articles'
// import { ISize } from './';

export interface IProduct {
  
    _id        : string;
    name       : string;
    description: string;
    images     : ImageObj[];
    inStock    : InStockSizes;
    price      : number;
    discount   : number;
    tags       : Tags[];
    sold       : number;
    slug       : string;
    isAble     : boolean;
  
}

export type Tags = 'accesorios' | 'consumibles' | 'ropa' | 'útil';

export const TagsArray: Tags[] = ['accesorios', 'consumibles', 'ropa', 'útil'];

export type Sizes = 'unique'|'S'|'M'|'L'|'XL'|'XXL'|'XXXL';

export const SizesArray: Sizes[] = [ 'unique', 'S','M', 'L', 'XL', 'XXL', 'XXXL' ];

export type InStockSizes = {
  unique: number;
  S?: number;
  M?: number;
  L?: number;
  XL?: number;
  XXL?: number;
  XXXL?: number;
}

// export interface ISold {
//   _id: string;
//   productId: string;
//   soldUnits: number;
// }

export const initialFavProducts: IProduct[] = [
    {
      _id: 'abcd1',
      images: [
        {
          url: '/perro-1.webp',
          alt: 'Perro 1',
          width: 300,
          height: 300,
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
          width: 250,
          height: 250,
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
      slug: '/capucha_perro_grande',
      isAble: true,
    },
    {
      _id: 'abcd2',
      images: [
        {
          url: '/perro-2.webp',
          alt: 'Perro 2',
          width: 250,
          height: 250,
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
          width: 300,
          height: 300,
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
      slug: '/recipiente_estrellado',
      isAble: true,
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
          width: 250,
          height: 250,
        },
        {
          url: '/perro-1.webp',
          alt: 'Perro 1',
          width: 300,
          height: 300,
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
      slug: '/perrarina_xxxxx_20kg',
      isAble: true,
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
          width: 250,
          height: 250,
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
      slug: '/vitamina_yyy',
      isAble: true,
    },
    {
      _id: 'abcde5',
      images: [
        {
          url: '/gato-2.jpg',
          alt: 'Perro cuadrado',
          width: 500,
          height: 500,
        },
        {
          url: '/perro-1.webp',
          alt: 'Perro 2',
          width: 250,
          height: 250,
        },
      ],
      name: 'Suplemento Vitamínico',
      description: 'Vitamina para reforzar las defensas de tu mascota y fomentar su crecimiento',
      price: 3,
      discount: 0,
      inStock: {
        unique: 15
      },
      tags: ['consumibles', 'útil'],
      sold: 0,
      slug: '/suplemento_vitaminico',
      isAble: true,
    },
    {
      _id: 'abcde6',
      images: [
        {
          url: '/gato-1.webp',
          alt: 'Perro 2',
          width: 250,
          height: 250,
        },
        {
          url: '/gato-2.jpg',
          alt: 'Perro cuadrado',
          width: 500,
          height: 500,
        },
        {
          url: '/Logo-Redes.png',
          alt: 'Perro cuadrado',
          width: 500,
          height: 500,
        },
      ],
      name: 'Hueso de Gomita',
      description: 'Hueso de gomita para que tu mascota se distraiga',
      price: 7,
      discount: 0.1,
      inStock: {
        unique: 6
      },
      tags: ['consumibles', 'accesorios'],
      sold: 0,
      slug: '/hueso_de_gomita',
      isAble: true,
    },
    {
      _id: 'abcde7',
      images: [
        {
          url: '/square-dog.jpg',
          alt: 'Perro 2',
          width: 250,
          height: 250,
        },
        {
          url: '/gato-2.jpg',
          alt: 'Perro cuadrado',
          width: 500,
          height: 500,
        },
        {
          url: '/Logo-Redes.png',
          alt: 'Perro cuadrado',
          width: 500,
          height: 500,
        },
      ],
      name: 'Arete para Gato',
      description: 'Arete para que tu mascota luzca original',
      price: 5,
      discount: 0.15,
      inStock: {
        unique: 6
      },
      tags: ['accesorios'],
      sold: 0,
      slug: '/arete_para_gato',
      isAble: true,
    },
]
  
export const initialProducts: IProduct[] = [
    {
      _id: 'abcd5',
      images: [
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
      discount: 0.1,
      inStock: {
        unique: 24
      },
      tags: ['consumibles', 'accesorios', 'útil'],
      sold: 0,
      slug: '/producto_1',
      isAble: true,
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
        {
          url: '/Logo-Redes.png',
          alt: 'Perro 2',
          width: 250,
          height: 250,
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
      slug: '/producto_2',
      isAble: true,
    },
    {
      _id: 'abcd7',
      images: [
        {
          url: '/Logo-Redes.png',
          alt: 'Perro 2',
          width: 250,
          height: 250,
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
        {
          url: '/Logo-MPR.png',
          alt: 'Perro 2',
          width: 250,
          height: 250,
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
      slug: '/producto_3',
      isAble: true,
    },
    {
      _id: 'abcd8',
      images: [
        {
          url: '/Logo-MPR.png',
          alt: 'Perro 2',
          width: 250,
          height: 250,
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
      slug: '/gorra_o_chapa',
      isAble: true,
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
          width: 250,
          height: 250,
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
      slug: '/producto_5',
      isAble: true,
    },
    {
      _id: 'abcd10',
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
          width: 250,
          height: 250,
        },
      ],
      name: 'Camisa patita de perro',
      description: 'Et reprehenderit amet excepteur voluptate',
      price: 4,
      discount: 0.5,
      inStock: {
        unique: -1,
        M: 3,
        S: 0,
        L: 6,
        XL: 7,
      },
      tags: ['ropa'],
      sold: 0,
      slug: '/camisa_patita_de_perro',
      isAble: true,
    },
    {
      _id: 'abcd11',
      images: [
        {
          url: '/gato-1.webp',
          alt: 'Perro 2',
          width: 250,
          height: 250,
        },
        {
          url: '/perro-1.webp',
          alt: 'Perro 1',
          width: 300,
          height: 300,
        },
        {
          url: '/gato-2.jpg',
          alt: 'Perro 2',
          width: 250,
          height: 250,
        },
      ],
      name: 'Camisa pata de gato',
      description: 'Veniam minim reprehenderit amet excepteur voluptate',
      price: 10,
      discount: 0,
      inStock: {
        unique: -1,
        M: 0,
        S: 0,
        L: 6,
        XL: 7,
      },
      tags: ['ropa'],
      sold: 0,
      slug: '/camisa_pata_de_gato',
      isAble: true,
    },
    {
      _id: 'abcd12',
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
          url: '/Logo-Redes.png',
          alt: 'Perro 2',
          width: 250,
          height: 250,
        },
      ],
      name: 'Pantalon rasgado',
      description: 'Amet excepteur voluptate',
      price: 15,
      discount: 0,
      inStock: {
        unique: -1,
        M: 0,
        L: 0,
        S: 0,
        XL: 7,
      },
      tags: ['ropa'],
      sold: 0,
      slug: '/pantalon_rasgado',
      isAble: true,
    },
    {
      _id: 'abcd13',
      images: [
        {
          url: '/perro-2.webp',
          alt: 'Perro 2',
          width: 250,
          height: 250,
        },
        {
          url: '/square-dog.jpg',
          alt: 'Perro cuadrado',
          width: 500,
          height: 500,
        },
        {
          url: '/Logo-MPR.png',
          alt: 'Perro 2',
          width: 250,
          height: 250,
        },
      ],
      name: 'Camiseta deportiva patitas',
      description: 'Voluptate non mensem',
      price: 1,
      discount: 0.2,
      inStock: {
        unique: -1,
        XXL: 0,
        XXXL: 0,
        M: 5,
        L: 6,
        XL: 7,
      },
      tags: ['ropa'],
      sold: 0,
      slug: '/camiseta_deportiva_patitas',
      isAble: true,
    },
]

export const allProducts = [...initialFavProducts, ...initialProducts]