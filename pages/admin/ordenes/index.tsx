import { useState } from 'react';
import { NextPage, GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { ConfirmationNumber } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { nextAuthOptions } from '../../api/auth/[...nextauth]';
import { MainLayout, OrderInfo } from '../../../components';
import { Box, Button, Chip, Grid, Typography } from '@mui/material';
import { dbOrders } from '../../../database';
import { IOrder, SpanishOrderStatus, StatusColors } from '../../../interfaces';
import { format } from '../../../utils';

interface Props {
  orders: IOrder[];
}

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'ID de Órden',
    renderCell: ({ row }: GridRenderCellParams) => {
      return <Typography sx={{ overflowX: 'auto' }}>{ row.id }</Typography>
    },
    width: 120
  },
  {
    field: 'user',
    headerName: 'ID del Usuario',
    renderCell: ({ row }: GridRenderCellParams) => {
      return <Typography sx={{ overflowX: 'auto' }}>{ row.user }</Typography>
    },
    sortable: false,
    disableColumnMenu: true,
    width: 120
  },
  {
    field: 'transaction',
    headerName: 'ID de la Transacción',
    renderCell: ({ row }: GridRenderCellParams) => {
      return <Typography sx={{ overflowX: 'auto' }}>{ row.transaction.transactionId }</Typography>
    },
    sortable: false,
    disableColumnMenu: true,
    width: 120
  },
  {
    field: 'seeOrder',
    headerName: 'Info Órden',
    renderCell: ({ row }: GridRenderCellParams) => {
      return (
        <Button color='secondary' onClick={ () => row.setOrder( row.order ) }>Ver órden</Button>
      )
    },
    sortable: false,
    disableColumnMenu: true,
    width: 120
  },
  {
    field: 'status',
    headerName: 'Estado',
    renderCell: ({ row }: GridRenderCellParams) => {
      return (
        <Box>
          <Chip
            // @ts-ignore
            color={ StatusColors[ row.transaction.status ] }
            // @ts-ignore
            label={ SpanishOrderStatus[ row.transaction.status ] }
            sx={{ fontWeight: 500, color: '#fff' }}
            variant='filled'
          />
        </Box>
      )
    },
    disableColumnMenu: true,
    width: 120
  },
  {
    field: 'total',
    headerName: 'Total',
    renderCell: ({ row }: GridRenderCellParams) => {
      return (
        <Typography>{ format( row.total ) }</Typography>
      )
    },
    width: 100
  },
  { field: 'method', headerName: 'Método', disableColumnMenu: true },
  { field: 'createdAt', headerName: 'Fecha de creación', disableColumnMenu: true, width: 200 },
]

const OrdenesPage: NextPage<Props> = ({ orders }) => {

  const [thisOrders, setThisOrders] = useState( orders );

  const [orderInfo, setOrderInfo] = useState<IOrder>({
    _id: '',
    user: '',
    orderItems: [],
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
    transaction: {
      status: 'notpaid',
      transactionId: '',
      method: 'Pago móvil',
      totalUSD: 0,
      totalBs: 0,
      paidUSD: 0,
      phone: '',
    },
    createdAt: Date.now(),
  });

  const rows = thisOrders.map(order => ({
    setOrder: setOrderInfo,
    id: order._id,
    user: order.user,
    order,
    orderItems: order.orderItems,
    shippingAddress: order.shippingAddress,
    contact: order.contact,
    transaction: order.transaction,
    method: order.transaction.method,
    total: order.transaction.totalUSD,
    createdAt: new Date( order.createdAt ).toLocaleString(),
  }));

  return (
    <MainLayout title='Órdenes' pageDescription='Información de las órdenes' titleIcon={ <ConfirmationNumber color='info' sx={{ fontSize: '1.5rem' }} /> } nextPage={ '/' }>

      {
        orders.length > 0
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
          : <Typography variant='h2'>No se encontraron órdenes en la base de datos.</Typography>
      }

      <>
      { orderInfo._id && <OrderInfo info={ orderInfo } orders={ thisOrders } setOrders={ setThisOrders } /> }
      </>

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