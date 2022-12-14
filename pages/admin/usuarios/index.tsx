import { useContext } from 'react';
import { NextPage, GetServerSideProps } from 'next';
import { AdminPanelSettings } from '@mui/icons-material';
import { Box, Button, Grid, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { unstable_getServerSession } from 'next-auth/next';
import { Session } from 'next-auth';

import { nextAuthOptions } from '../../api/auth/[...nextauth]';
import { dbUsers } from '../../../database';
import { MainLayout } from '../../../components';
import { IUser, Role } from '../../../interfaces';
import { useSnackbar } from 'notistack';
import { ConfirmNotificationButtons, PromiseConfirmHelper } from '../../../utils';
import { ScrollContext } from '../../../context';

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'ID del Usuario',
    sortable: false,
    disableColumnMenu: true,
    description: 'Visita la página del usuario',
    renderCell: ({ row }: GridRenderCellParams) => {
      return <Typography sx={{ overflowX: 'auto' }}>{ row.id }</Typography>
    },
    width: 130
  },
  { field: 'name', headerName: 'Nombre', width: 300 },
  { field: 'email', headerName: 'Correo', width: 300 },
  { field: 'role', headerName: 'Rol', width: 100 },
  {
    field: 'isSubscribed',
    headerName: 'Suscrito',
    renderCell: ({ row }: GridRenderCellParams) => {
      return <p>{ row.isSubscribed ? 'Sí' : 'No' }</p>
    },
    align: 'center',
    disableColumnMenu: true,
    width: 90
  },
  { field: 'createdAt', headerName: 'Creado el', disableColumnMenu: true, width: 120 },
  {
    field: 'updateUser',
    headerName: 'Acciones',
    sortable: false,
    disableColumnMenu: true,
    renderCell: ({ row }: GridRenderCellParams) => {
      if ( row.thisUserId === row.id ) return <></>
      return (
        <Box display='flex' gap='.5rem' sx={{ overflowX: 'auto' }}>
          <Button color='warning' variant='outlined' disabled={ row.role === 'user' } onClick={ () => row.updateUser( row.id, 'user' ) }>User</Button>
          <Button color='warning' variant='outlined' disabled={ row.role === 'superuser' } onClick={ () => row.updateUser( row.id, 'superuser' ) }>Superuser</Button>
          <Button color='warning' variant='outlined' disabled={ row.role === 'admin' } onClick={ () => row.updateUser( row.id, 'admin' ) }>Admin</Button>
        </Box>
      )
    },
    width: 240
  },
  {
    field: 'isEnable',
    headerName: 'Habilitado',
    disableColumnMenu: true,
    align: 'center',
    renderCell: ({ row }: GridRenderCellParams) => {
      return (
        <p>{ row.isEnable ? 'Sí' : 'No' }</p>
      )
    }
  },
  {
    field: 'enableUser',
    headerName: 'Eliminar',
    sortable: false,
    disableColumnMenu: true,
    renderCell: ({ row }: GridRenderCellParams) => {
        return row.thisUserId !== row.id
        ? <Button color={ row.isEnable ? 'error' : 'success' } onClick={ () => row.enableUser( row.id, !row.isEnable ) }>{ row.isEnable ? 'Eliminar' : 'Habilitar' }</Button>
        : <></>
    }
  }
]

interface Props {
  users: IUser[];
  adminId: Session;
}

const UsuariosPage: NextPage<Props> = ({ users, adminId }) => {

  const { setIsLoading } = useContext( ScrollContext );
  const { enqueueSnackbar } = useSnackbar();

  const updateUser = async ( userId: string, role: Role ) => {
      let key = enqueueSnackbar(`¿Segur@ quieres hacer este usuario ${ role }?`, {
          variant: 'info',
          autoHideDuration: 10000,
          action: ConfirmNotificationButtons,
      });

      const confirm = await PromiseConfirmHelper( key, 10000 );

      if ( !confirm ) return;

      setIsLoading( true );
      
      const res = await dbUsers.updateUserRole( userId, role );
      
      setIsLoading( false );

      enqueueSnackbar(res.message, { variant: !res.error ? 'info' : 'error', autoHideDuration: 5000 });
  }
  
  const enableUser = async ( userId: string, enable: boolean ) => {
      let key = enqueueSnackbar(`¿Segur@ que quieres ${ enable ? 'habilitar' : 'eliminar' } este usuario?`, {
          variant: 'info',
          autoHideDuration: 10000,
          action: ConfirmNotificationButtons,
      });

      const confirm = await PromiseConfirmHelper( key, 10000 );

      if ( !confirm ) return;

      setIsLoading( true );

      const res = await dbUsers.deleteUserById( userId, enable );

      setIsLoading( false );
        
      enqueueSnackbar(res.message, { variant: !res.error ? 'info' : 'error', autoHideDuration: 5000 });
  }

  const rows = users.map(( user ) => ({
    id: user._id,
    thisUserId: adminId,
    name: user.name,
    email: user.email,
    role: user.role,
    isSubscribed: user.isSubscribed,
    createdAt: new Date( user.createdAt ).toLocaleDateString(),
    isEnable: user.isAble,
    enableUser,
    updateUser,
  }))

  return (
    <MainLayout title='Usuarios' pageDescription='Información de los usuario' titleIcon={ <AdminPanelSettings color='info' sx={{ fontSize: '1.5rem' }} /> } nextPage='/' url='/'>

      {
        users.length > 0
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
          : <Typography>No se encontraron usuarios en la base de datos.</Typography>
      }

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

  const users = await dbUsers.getAllUsers();

  if ( !users ) {
    ctx.req.cookies = {
      mpr__notification: JSON.stringify({
        notificationMessage: 'Ocurrió un error obteniendo los usuarios',
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
      users,
      // @ts-ignore
      adminId: session.user._id,
    }
  }
}

export default UsuariosPage;