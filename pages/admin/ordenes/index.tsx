import { useState } from 'react';
import { NextPage, GetServerSideProps } from 'next';
import { unstable_getServerSession } from "next-auth/next";
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ConfirmationNumber from '@mui/icons-material/ConfirmationNumber';

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
  { field: 'method', headerName: 'Método', disableColumnMenu: true },
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
        <Button className='button button--round low--padding low--font--size' onClick={ () => row.setOrder( row.order ) }>Ver órden</Button>
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

  const updateOrderStatus = ( orderInfo: IOrder ) =>
    setThisOrders(( prevState ) => prevState.map(( o ) => o._id !== orderInfo._id ? o : orderInfo));

  return (
    <MainLayout title='Órdenes' pageDescription='Información de las órdenes' titleIcon={ <ConfirmationNumber color='info' sx={{ fontSize: '1.5rem' }} /> } nextPage='/' url='/'>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '1rem', alignItems: { xs: 'center', sm: 'stretch' }, flexDirection: { xs: 'column', sm: 'row', mt: 1.5 } }}>
        <Box sx={{ display: 'flex', gap: '.5rem', minWidth: '220px', borderRadius: '1rem', backgroundColor: '#fff', boxShadow: '0 5px .5rem -.3rem #666', padding: '.8rem' }}>
          <Box display='flex' alignItems='center'>
            <LocalShippingIcon sx={{ fontSize: '2.6rem', color: 'var(--secondary-color-1)' }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: '2rem', lineHeight: 1.2 }}>{ thisOrders.reduce((prev, { transaction }) => prev += transaction.status === 'send' ? 1 : 0, 0) } <span style={{ fontSize: '1.5rem' }}>órdenes</span></Typography>
            <Typography variant='caption' sx={{ fontSize: '1rem' }}>han sido enviadas</Typography>
          </Box>
        </Box>

        <Box display='flex' sx={{ gap: '.5rem', minWidth: '220px', borderRadius: '1rem', backgroundColor: '#fff', boxShadow: '0 5px .5rem -.3rem #666', padding: '.8rem' }}>
          <Box display='flex' alignItems='center'>
            <PaymentIcon color='success' sx={{ fontSize: '2.6rem' }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: '2rem', lineHeight: 1.2 }}>{ thisOrders.reduce((prev, { transaction }) => prev += transaction.status === 'paid' ? 1 : 0, 0) } <span style={{ fontSize: '1.5rem' }}>órden{ thisOrders.reduce((prev, { transaction }) => prev += transaction.status === 'paid' ? 1 : 0, 0) === 1 ? '' : 'es' }</span></Typography>
            <Typography sx={{ fontSize: '1rem' }}>pagada{ thisOrders.reduce((prev, { transaction }) => prev += transaction.status === 'paid' ? 1 : 0, 0) === 1 ? '' : 's' } por enviar</Typography>
          </Box>
        </Box>

        <Box display='flex' sx={{ gap: '.5rem', minWidth: '220px', borderRadius: '1rem', backgroundColor: '#fff', boxShadow: '0 5px .5rem -.3rem #666', padding: '.8rem' }}>
          <Box display='flex' alignItems='center'>
            <WarningAmberIcon color='warning' sx={{ fontSize: '2.6rem' }} />
          </Box>
          <Box>
            <Typography sx={{ fontSize: '2rem', lineHeight: 1.2 }}>{ thisOrders.reduce((prev, { transaction }) => prev += transaction.status === 'pending' ? 1 : 0, 0) } <span style={{ fontSize: '1.5rem' }}>órden{ thisOrders.reduce((prev, { transaction }) => prev += transaction.status === 'pending' ? 1 : 0, 0) === 1 ? '' : 'es' }</span></Typography>
            <Typography variant='caption' sx={{ fontSize: '1rem' }}>está{ thisOrders.reduce((prev, { transaction }) => prev += transaction.status === 'pending' ? 1 : 0, 0) === 1 ? '' : 'n' } pendiente{ thisOrders.reduce((prev, { transaction }) => prev += transaction.status === 'pending' ? 1 : 0, 0) === 1 ? '' : 's' }</Typography>
          </Box>
        </Box>
      </Box>

      {
        orders.length > 0
          ? <Grid container className='fadeIn' sx={{ backgroundColor: '#fafafa', borderRadius: '4px', mt: 2 }}>
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
      { orderInfo._id && <OrderInfo info={ orderInfo } updateOrderStatus={ updateOrderStatus } /> }
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