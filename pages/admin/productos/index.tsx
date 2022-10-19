import { useContext, useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { Typography, CardMedia, Box, Grid, Link, Button } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Category } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

import { dbProducts } from '../../../database';
import { mprRevalidatePage } from '../../../mprApi';
import { ScrollContext } from '../../../context';
import { AdminProductInfo, MainLayout } from '../../../components';
import { format } from '../../../utils';
import { InStockSizes, IProduct, Sizes, Tags } from '../../../interfaces';
import { getSession } from 'next-auth/react';

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
            images: row.images,
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
    headerName: 'Vendidos',
    sortable: false,
    disableColumnMenu: true,
    align: 'center',
    width: 90,
  },
  {
    field: 'deleteProduct',
    headerName: 'Eliminar',
    sortable: false,
    disableColumnMenu: true,
    // @ts-ignore
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <Button color='error' onClick={ () => row.deleteProduct( row.id ) }>Eliminar</Button>
      )
    }
  }
]

interface Props {
  products: IProduct[];
}

const newProductInitialState: IProduct = {
  _id: '',
  name: '',
  description: '',
  images: [],
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

const ProductosPage: NextPage<Props> = ({ products }) => {

  const [newProduct, setNewProduct] = useState( newProductInitialState );
  const [method, setMethod] = useState<'create' | 'update'>('create');
  const { enqueueSnackbar } = useSnackbar();
  const { setIsLoading } = useContext( ScrollContext );
  
  const deleteProduct = async ( id: string ) => {
    setIsLoading( true );

    const res = await dbProducts.deleteProductById( id );

    enqueueSnackbar(res.message, { variant: !res.error ? 'info' : 'error' });

    if ( !res.error ) {
      if ( process.env.NODE_ENV === 'production' ) {
          const revRes = await mprRevalidatePage( '/tienda' );
          enqueueSnackbar(revRes.message || 'Error', { variant: !revRes.error ? 'info' : 'error' });                    
          
          const revRes2 = await mprRevalidatePage( '/tienda/categoria' );
          enqueueSnackbar(revRes.message || 'Error', { variant: !revRes.error ? 'info' : 'error' });                    
      }
    }
  }

  const rows = products.map(product => ({
    id: product._id,
    images: [...product.images],
    name: product.name,
    description: product.description,
    inStock: product.inStock,
    price: product.price,
    discount: product.discount,
    tags: product.tags,
    sold: product.sold,
    slug: product.slug,
    setNewProduct: ( p: IProduct ) => {
      setMethod( 'update' );
      setNewProduct(p);
    },
    deleteProduct,
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

      <AdminProductInfo product={ newProduct } method={ method } setMethod={ setMethod } products={ products } />

    </MainLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ( ctx ) => {

  let products = await dbProducts.getAllProducts();

  if ( !products ) products = [];

  const session = await getSession( ctx );

  const validRoles = ['superuser', 'admin']; 

  // @ts-ignore
  if ( !session || !session.user || !validRoles.includes( session.user.role ) ) {
    ctx.req.cookies = {
      mpr__notification: JSON.stringify({
        notificationMessage: 'No tiene permiso para ver esta api',
        notificationVariant: 'error',
      })
    }

    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  return {
    props: {
      products,
    }
  }
}

export default ProductosPage;