import { GetServerSideProps, NextPage } from 'next';
import { Category } from '@mui/icons-material';

import { MainLayout } from '../../../components';
import { Typography, CardMedia, Box, Grid, Link } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useContext } from 'react';
import { ScrollContext } from '../../../context';
import { IProduct } from '../../../interfaces';
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
          image={ row.image.url }
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

const ProductosPage: NextPage<Props> = ({ products }) => {

  const { isLoading } = useContext( ScrollContext );

  const rows = products.map(product => ({
    id: product._id,
    image: product.images[0],
    name: product.name,
    inStock: product.inStock,
    price: product.price,
    discount: product.discount,
    tags: product.tags,
    sold: product.sold,
    slug: product.slug,
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