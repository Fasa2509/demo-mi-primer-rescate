import { useContext, useState } from 'react';
import { NextPage, GetServerSideProps } from 'next';
import { AdminPanelSettings } from '@mui/icons-material';
import { Box, Button, Grid, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import { dbUsers } from '../../../database';
import { MainLayout } from '../../../components';
import { IUser, Role } from '../../../interfaces';
import { useSnackbar } from 'notistack';
import { ConfirmNotificationButtons, PromiseConfirmHelper } from '../../../utils';
import { ScrollContext } from '../../../context';
import { getSession } from 'next-auth/react';

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'ID del Usuario',
    sortable: false,
    disableColumnMenu: true,
    description: 'Visita la página del usuario',
    // @ts-ignore
    renderCell: ({ row }: GridValueGetterParams) => {
      return <Typography sx={{ overflowX: 'auto' }}>{ row.id }</Typography>
    },
    width: 130
  },
  { field: 'name', headerName: 'Nombre', width: 300 },
  { field: 'email', headerName: 'Correo', width: 300 },
  { field: 'role', headerName: 'Rol', width: 100 },
  {
    field: 'isSubscribed',
    headerName: 'Subscrito',
    // @ts-ignore
    renderCell: ({ row }: GridValueGetterParams) => {
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
    // @ts-ignore
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <Box display='flex' gap='.5rem' sx={{ overflowX: 'auto' }}>
          <Button color='warning' variant='outlined' onClick={ () => row.updateUser( row.id, 'user' ) }>User</Button>
          <Button color='warning' variant='outlined' onClick={ () => row.updateUser( row.id, 'superuser' ) }>Superuser</Button>
          <Button color='warning' variant='outlined' onClick={ () => row.updateUser( row.id, 'admin' ) }>Admin</Button>
        </Box>
      )
    },
    width: 240
  },
  {
    field: 'deleteUser',
    headerName: 'Eliminar',
    sortable: false,
    disableColumnMenu: true,
    // @ts-ignore
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <Button color='error' onClick={ () => row.deleteUser( row.id ) }>Eliminar</Button>
      )
    }
  }
]

interface Props {
  users: IUser[];
}

const UsuariosPage: NextPage<Props> = ({ users }) => {

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
  
  const deleteUser = async ( userId: string ) => {
      let key = enqueueSnackbar('¿Segur@ que quieres eliminar este usuario?', {
          variant: 'info',
          autoHideDuration: 10000,
          action: ConfirmNotificationButtons,
      });

      const confirm = await PromiseConfirmHelper( key, 10000 );

      if ( !confirm ) return;

      setIsLoading( true );

      const res = await dbUsers.deleteUserById( userId );

      setIsLoading( false );
        
      enqueueSnackbar(res.message, { variant: !res.error ? 'info' : 'error', autoHideDuration: 5000 });
  }

  const rows = users.map(( user ) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isSubscribed: user.isSubscribed,
    createdAt: new Date( user.createdAt ).toLocaleDateString(),
    deleteUser,
    updateUser,
  }))

  return (
    <MainLayout title='Usuarios' pageDescription='Información de los usuario' titleIcon={ <AdminPanelSettings color='info' sx={{ fontSize: '1.5rem' }} /> } nextPage={ '/' }>

      {
        users.length > 0
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
          : <Typography>No se encontraron usuarios en la base de datos.</Typography>
      }

    </MainLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ( ctx ) => {

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
      users,
    }
  }
}

export default UsuariosPage;