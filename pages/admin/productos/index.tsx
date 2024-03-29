import { useContext, useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { Typography, Box, Grid, Link, Button } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Category from '@mui/icons-material/Category';
import { useSnackbar } from 'notistack';
import { getServerSession } from "next-auth/next";
import { nextAuthOptions } from '../../api/auth/[...nextauth]';

import { dbProducts } from '../../../database';
import { mprRevalidatePage } from '../../../mprApi';
import { ScrollContext } from '../../../context';
import { AdminProductInfo, MainLayout, MyImage } from '../../../components';
import { ConfirmNotificationButtons, format, PromiseConfirmHelper } from '../../../utils';
import { IProduct } from '../../../interfaces';

const columns: GridColDef[] = [
  {
    field: 'image',
    headerName: 'Imagen',
    // @ts-ignore
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <Box sx={{ position: 'relative', width: '90%', aspectRatio: '1/1', margin: '0 auto' }}>
          <MyImage src={ row.images[0].url } alt={ row.images[0].alt } width={ 1 } height={ 1 } layout='responsive' sm />
        </Box>
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
        <Link href={ `/tienda?product=${ row.slug.replace("/", "") }` } color='info' target='_blank' rel='noreferrer'>
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
    width: 135,
  },
  {
    field: 'setNewProduct',
    headerName: 'Editar',
    // @ts-ignore
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <Button
          className='button low--padding button--round low--font--size'
          onClick={ () => row.setNewProduct( row.rowProduct ) }
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
    field: 'switchProductAbility',
    headerName: 'Habilitado',
    disableColumnMenu: true,
    // @ts-ignore
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <Button className={ `button low--padding button--round low--font--size ${ row.isAble ? 'button--error' : 'button--success' }` } onClick={ () => row.switchProductAbility( row.id, row.name, row.isAble ) }>{ row.isAble ? 'Eliminar' : 'Habilitar' }</Button>
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
  slug: '',
  isAble: true,
  createdAt: (() => Date.now())(),
}

const ProductosPage: NextPage<Props> = ({ products: P }) => {

  const [products, setProducts] = useState( P );
  const [newProduct, setNewProduct] = useState( newProductInitialState );
  const [method, setMethod] = useState<'create' | 'update'>('create');
  const { enqueueSnackbar } = useSnackbar();
  const { setIsLoading } = useContext( ScrollContext );
  
  const switchProductAbility = async ( id: string, name: string, isAble: boolean, ) => {
    let key = enqueueSnackbar(`¿Quieres ${ isAble ? 'eliminar' : 'habilitar' } ${ name }?`, {
      variant: isAble ? 'warning' : 'info',
      autoHideDuration: 10000,
      action: ConfirmNotificationButtons,
    });

    let accepted = await PromiseConfirmHelper(key, 10000);

    if ( !accepted ) return;

    setIsLoading( true );
    
    const res = await dbProducts.switchProductAbilityById( id );
    
    enqueueSnackbar(res.message, { variant: !res.error ? 'info' : 'error' });
    
    if ( !res.error ) {
      setProducts( products.map(( p ) => p._id === id ? { ...p, isAble: !isAble } : p) );
      if ( process.env.NODE_ENV === 'production' ) {
          const responses = await Promise.all([
            mprRevalidatePage( '/tienda' ),
            mprRevalidatePage( '/tienda/categoria' )
          ]);

          responses.forEach(( r ) => enqueueSnackbar(r.message || 'Error', { variant: !r.error ? 'info' : 'error' }) );
        }
    }
    
    setIsLoading( false );
  }

  const rows = products.map(product => ({
    rowProduct: product,
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
    isAble: product.isAble,
    switchProductAbility,
  }));

  const clearProductInfo = () => setNewProduct( newProductInitialState );

  const updateProductsInfo = ( aProduct: IProduct ) =>
    setProducts(( prevState ) => prevState.map(( p ) => ( p._id !== aProduct._id ) ? p : aProduct));

  return (
    <MainLayout title='Productos' pageDescription='Información de los productos' titleIcon={ <Category color='info' sx={{ fontSize: '1.5rem' }} /> } nextPage='/' url='/'>

      {
        products.length > 0
          ? <Grid container className='fadeIn' sx={{ backgroundColor: '#fafafa', borderRadius: '4px' }}>
              <Grid item xs={ 12 } sx={{ height: 660, width: '100%' }}>
                <DataGrid
                    rows={ rows }
                    columns={ columns }
                    pageSize={ 10 }
                    rowsPerPageOptions={ [10] }
                />
              </Grid>
            </Grid>
          : <Typography variant='h2'>No se encontraron productos en la base de datos.</Typography>
      }

      <AdminProductInfo product={ newProduct } method={ method } setMethod={ setMethod } clearProductInfo={ clearProductInfo } updateProductsInfo={ updateProductsInfo } />

    </MainLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ( ctx ) => {

  let products = await dbProducts.getAllProducts();

  if ( !products ) products = [];

  const session = await getServerSession( ctx.req, ctx.res, nextAuthOptions );

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