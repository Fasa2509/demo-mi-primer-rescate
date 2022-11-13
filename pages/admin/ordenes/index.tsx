import { useState } from 'react';
import { NextPage, GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { ConfirmationNumber } from '@mui/icons-material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import { nextAuthOptions } from '../../api/auth/[...nextauth]';
import { MainLayout, OrderInfo } from '../../../components';
import { Box, Chip, Grid, Typography } from '@mui/material';
import { dbOrders } from '../../../database';
import { IOrder, IOrderInfo } from '../../../interfaces';
import { format } from '../../../utils';

interface Props {
  orders: IOrder[];
}

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'ID de Orden',
    // @ts-ignore
    renderCell: ({ row }: GridValueGetterParams) => {
      return <Typography sx={{ overflowX: 'auto' }}>{ row.id }</Typography>
    },
    width: 120
  },
  {
    field: 'user',
    headerName: 'ID del Usuario',
    // @ts-ignore
    renderCell: ({ row }: GridValueGetterParams) => {
      return <Typography sx={{ overflowX: 'auto' }}>{ row.user }</Typography>
    },
    sortable: false,
    disableColumnMenu: true,
    width: 120
  },
  {
    field: 'seeOrder',
    headerName: 'Info Orden',
    // @ts-ignore
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <Typography sx={{ color: '#666', textDecoration: 'underline', cursor: 'pointer' }} onClick={ () => row.setOrder({ orderId: row.id, products: row.orderItems, isPaid: row.isPaid, total: row.total, shippingAddress: row.shippingAddress, contact: row.contact, createdAt: row.createdAt }) }>Ver Orden</Typography>
      )
    },
    sortable: false,
    disableColumnMenu: true,
    width: 120
  },
  {
    field: 'isPaid',
    headerName: 'Pagada',
    // @ts-ignore
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <Box>
          <Chip
            color={ ( row.isPaid ) === 'paid' ? 'success' : ( row.isPaid === 'notpaid' ) ? 'error' : 'warning' }
            label={ ( row.isPaid ) === 'paid' ? 'Pagada' : ( row.isPaid === 'notpaid' ) ? 'No pagada' : 'Pendiente' }
            variant='filled'
          />
        </Box>
      )
    },
    disableColumnMenu: true,
    width: 120
  },
  { field: 'total', headerName: 'Total', width: 210 },
  { field: 'createdAt', headerName: 'Fecha de creación', disableColumnMenu: true, width: 200 },
]

const OrdenesPage: NextPage<Props> = ({ orders }) => {

  const [thisOrders, setThisOrders] = useState( orders );

  const [orderInfo, setOrderInfo] = useState<IOrderInfo>({
    orderId: '',
    products: [],
    total: 0,
    isPaid: 'notpaid',
    shippingAddress: {
      address: '',
      maps: {
        longitude: null,
        latitude: null,
      },
    },
    contact: {
      name: '',
      facebook: '',
      instagram: '',
      whatsapp: '',
    },
    createdAt: '',
  });

  const rows = thisOrders.map(order => ({
    setOrder: setOrderInfo,
    id: order._id,
    user: order.user,
    seeOrder: '',
    isPaid: order.isPaid,
    total: `${ format( order.total ) } = Bs. ${ (order.total * 8.23).toFixed(2) }`,
    orderItems: order.orderItems,
    shippingAddress: order.shippingAddress,
    contact: order.contact,
    createdAt: new Date( order.createdAt ).toLocaleString(),
  }))

  return (
    <MainLayout title='Órdenes' pageDescription='Información de las órdenes' titleIcon={ <ConfirmationNumber color='info' sx={{ fontSize: '1.5rem' }} /> } nextPage={ '/' }>

      {
        orders.length > 0
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
          : <Typography variant='h2'>No se encontraron órdenes en la base de datos.</Typography>
      }

      <OrderInfo info={ orderInfo } orders={ thisOrders } setOrders={ setThisOrders } />

    </MainLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ( ctx ) => {

  const session = await unstable_getServerSession( ctx.req, ctx.res, nextAuthOptions );

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

  const orders = await dbOrders.getAllOrders();

  if ( !orders ) {
    ctx.req.cookies = {
      mpr__notification: JSON.stringify({
        notificationMessage: 'Ocurrió un error obteniendo las órdenes',
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
      orders,
    }
  }
}

export default OrdenesPage;