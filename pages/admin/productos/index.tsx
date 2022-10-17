import { useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { Category } from '@mui/icons-material';

import { AdminProductInfo, MainLayout } from '../../../components';
import { Typography, CardMedia, Box, Grid, Link, Button } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useContext } from 'react';
import { ScrollContext } from '../../../context';
import { InStockSizes, IProduct, Sizes, Tags } from '../../../interfaces';
import { dbProducts } from '../../../database';
import { format } from '../../../utils';

const columns: GridColDef[] = [
  {
    field: 'image',
    headerName: 'Imagen',
    // @ts-ignore
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <CardMedia
          component='img'
          className='fadeIn'
          image={ row.images[0].url }
          alt={ row.images[0].alt }
        />
      )
    },
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: 'name',
    headerName: 'Nombre',
    description: 'Visita la página del producto',
    // @ts-ignore
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <Link href={ `/tienda${ row.slug }` } color='info' target='_blank' rel='noreferrer'>
            <Typography className='admin__link'>{ row.name }</Typography>
        </Link>
      )
    },
    width: 250,
  },
  {
    field: 'inStock',
    headerName: 'Existencia',
    // @ts-ignore
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <Box display='flex' gap='.5rem' sx={{ overflowX: 'auto' }}>
          {
            Object.entries( row.inStock ).map(( el ) => {
              if ( el[1] === -1 ) return <div key={ el[0] } style={{ display: 'none' }}></div>
              if ( el[0] === '_id' ) return <div key={ el[0] } style={{ display: 'none' }}></div>
              if ( el[0] === 'unique' ) return <p key={ el[0] }><>única: { el[1] }</></p>
              if ( row.inStock.unique > -1 && el[1] === 0 ) return <div key={ el[0] } style={{ display: 'none' }}></div>
              return <p key={ el[0] }><>{ el[0] }: { el[1] }</></p>
            })
          }
        </Box>
      )
    },
    sortable: false,
    disableColumnMenu: true,
    width: 180,
  },
  {
    field: 'price',
    headerName: 'Precio',
    // @ts-ignore
    renderCell: ({ row }: GridValueGetterParams) => {
      return <p>{ format( row.price ) }</p>
    },
  },
  {
    field: 'discount',
    headerName: 'Descuento',
    // @ts-ignore
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <p>{ -1 * row.discount * 100 }{ row.discount > 0 ? '%' : '' }{ row.discount > 0 && ` = ${ format( row.price - row.discount * row.price ) }` }</p>
      )
    },
    sortable: false,
    disableColumnMenu: true,
    align: 'center',
  },
  {
    field: 'setNewProduct',
    headerName: 'Editar',
    // @ts-ignore
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <Button
          color='secondary'
          onClick={ () => row.setNewProduct({
            _id: row.id,
            name: row.name,
            description: row.description,
            images: [row.images],
            inStock: row.inStock,
            price: row.price,
            discount: row.discount,
            tags: row.tags,
            sold: row.sold,
            slug: row.slug,
          })
          }
        >
          Ver info
        </Button>
      )
    },
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: 'tags',
    headerName: 'Etiquetas',
    // @ts-ignore
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <Box display='flex' gap='.5rem' sx={{ overflowX: 'auto' }}>
          {
            row.tags.map(( tag: string ) => <p key={ tag }>#{ tag }</p>)
          }
        </Box>
      )
    },
    sortable: false,
    width: 100,
  },
  {
    field: 'sold',
    headerName: 'Vendido',
    sortable: false,
    disableColumnMenu: true,
    align: 'center',
    width: 90,
  },
]

interface Props {
  products: IProduct[];
}

const newProductInitialState: IProduct = {
  _id: '',
  name: '',
  description: '',
  images: [
    {
      url: '',
      alt: '',
      width: 500,
      height: 500,
    }
  ],
  inStock: {
    unique: 0,
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
    XXL: 0,
    XXXL: 0,
  },
  price: 0,
  discount: 0,
  tags: [],
  sold: 0,
  slug: '/',
}

// export interface FormProductState {
//   _id: string;
//   description: string;
//   price: number;
//   inStock: InStockSizes;
//   tags: Tags[];
// }

// export const formInitialState: FormProductState = {
//   _id: '',
//   description: '',
//   price: 0,
//   inStock: {
//     unique: 0,
//     S: 0,
//     M: 0,
//     L: 0,
//     XL: 0,
//     XXL: 0,
//     XXXL: 0,
//   },
//   tags: [],
// }

const ProductosPage: NextPage<Props> = ({ products }) => {

  const [newProduct, setNewProduct] = useState( newProductInitialState );
  const [method, setMethod] = useState<'create' | 'update'>('create');
  // const [form, setForm] = useState<FormProductState>( formInitialState );

  // const setNewProduct_ = (p: IProduct) => {
  //   setBool( !bool );
  //   setForm( formInitialState );
  //   setNewProduct( p );
  // }

  const rows = products.map(product => ({
    id: product._id,
    images: product.images,
    name: product.name,
    description: product.description,
    inStock: product.inStock,
    price: product.price,
    discount: product.discount,
    tags: product.tags,
    sold: product.sold,
    slug: product.slug,
    setNewProduct: ( p: any ) => {
      setMethod( 'update' );
      setNewProduct(p);
    },
  }))

  return (
    <MainLayout title='Productos' pageDescription='Información de los productos' titleIcon={ <Category color='info' sx={{ fontSize: '1.5rem' }} /> } nextPage={ '/' }>

      {
        products.length > 0
          ? <Grid container className='fadeIn'>
              <Grid item xs={ 12 } sx={{ height: 660, width: '100%' }}>
                <DataGrid
                    rows={ rows }
                    columns={ columns }
                    pageSize={ 10 }
                    rowsPerPageOptions={ [10] }
                />
              </Grid>
            </Grid>
          : <Typography variant='h2'>Ocurrió un error buscando los productos en la base de datos.</Typography>
      }

      {/* {
        ( bool )
          ? <AdminProductInfo product={ newProduct } setProduct={ setNewProduct_ } form={ form } setForm={ setForm } />
          : <AdminProductInfo product={ newProduct } setProduct={ setNewProduct_ } form={ form } setForm={ setForm } />
      } */}

      <AdminProductInfo product={ newProduct } method={ method } setMethod={ setMethod } />

    </MainLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ( ctx ) => {

  let products = await dbProducts.getAllProducts();

  if ( !products ) products = [];

  return {
    props: {
      products,
    }
  }
}

export default ProductosPage;