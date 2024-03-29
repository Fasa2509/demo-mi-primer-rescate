import { useContext, useState } from 'react';
import { NextPage, GetServerSideProps } from 'next';
import AdminPanelSettings from '@mui/icons-material/AdminPanelSettings';
import { Box, Button, Grid, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { getServerSession } from "next-auth/next";
import { Session } from 'next-auth';

import { nextAuthOptions } from '../../api/auth/[...nextauth]';
import { dbUsers } from '../../../database';
import { MainLayout } from '../../../components';
import { IUser, Role } from '../../../interfaces';
import { useSnackbar } from 'notistack';
import { ConfirmNotificationButtons, PromiseConfirmHelper } from '../../../utils';
import { ScrollContext } from '../../../context';
import { getPaginatedUsers } from '../../../database/dbUsers';

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'ID del Usuario',
    sortable: false,
    disableColumnMenu: true,
    description: 'Visita la página del usuario',
    renderCell: ({ row }: GridRenderCellParams) => {
      return <Typography sx={{ overflowX: 'auto' }}>{row.id}</Typography>
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
      return <p>{row.isSubscribed ? 'Sí' : 'No'}</p>
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
      if (row.thisUserId === row.id) return <></>
      return (
        <Box display='flex' gap='.5rem' sx={{ overflowX: 'auto' }}>
          <Button color='warning' variant='outlined' disabled={row.role === 'user'} onClick={() => row.updateUser(row.id, 'user')}>User</Button>
          <Button color='warning' variant='outlined' disabled={row.role === 'superuser'} onClick={() => row.updateUser(row.id, 'superuser')}>Superuser</Button>
          <Button color='warning' variant='outlined' disabled={row.role === 'admin'} onClick={() => row.updateUser(row.id, 'admin')}>Admin</Button>
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
        <p>{row.isEnable ? 'Sí' : 'No'}</p>
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
        ? <Button className={`button button--round low--padding low--font--size ${row.isEnable ? 'button--error' : 'button--success'}`} onClick={() => row.enableUser(row.id, !row.isEnable)}>{row.isEnable ? 'Eliminar' : 'Habilitar'}</Button>
        : <></>
    }
  }
]

interface Props {
  users: IUser[];
  adminId: Session;
}

const UsuariosPage: NextPage<Props> = ({ users: actualUsers, adminId }) => {

  const [users, setUsers] = useState(actualUsers);
  const [page, setPage] = useState(1);
  const { setIsLoading } = useContext(ScrollContext);
  const { enqueueSnackbar } = useSnackbar();

  const getMoreUsers = async () => {
    setIsLoading(true);
    const res = await getPaginatedUsers(page);
    setIsLoading(false);

    if (res.error) return enqueueSnackbar(res.message, { variant: 'error', autoHideDuration: 7000 });

    if (res.payload) {
      if (res.payload.users.length > 0) {
        setUsers((prev) => [...prev, ...res.payload!.users])
        setPage((prevState) => prevState + 1);
      } else {
        enqueueSnackbar(res.message, { variant: 'info', autoHideDuration: 7000 });
      }
    }
  }

  const updateUser = async (userId: string, role: Role) => {
    let key = enqueueSnackbar(`¿Segur@ quieres hacer este usuario ${role}?`, {
      variant: 'info',
      autoHideDuration: 10000,
      action: ConfirmNotificationButtons,
    });

    const confirm = await PromiseConfirmHelper(key, 10000);

    if (!confirm) return;

    setIsLoading(true);
    const res = await dbUsers.updateUserRole(userId, role);
    setIsLoading(false);

    setUsers((prevState) => prevState.map((u) => u._id !== userId ? u : { ...u, role }));

    enqueueSnackbar(res.message, { variant: !res.error ? 'info' : 'error', autoHideDuration: 5000 });
  }

  const enableUser = async (userId: string, enable: boolean) => {
    let key = enqueueSnackbar(`¿Segur@ que quieres ${enable ? 'habilitar' : 'eliminar'} este usuario?`, {
      variant: 'info',
      autoHideDuration: 10000,
      action: ConfirmNotificationButtons,
    });

    const confirm = await PromiseConfirmHelper(key, 10000);

    if (!confirm) return;

    setIsLoading(true);
    const res = await dbUsers.deleteUserById(userId, enable);
    setIsLoading(false);

    setUsers((prevState) => prevState.map((u) => u._id !== userId ? u : { ...u, isAble: enable }));

    enqueueSnackbar(res.message, { variant: !res.error ? 'info' : 'error', autoHideDuration: 5000 });
  }

  const rows = users.map((user) => ({
    id: user._id,
    thisUserId: adminId,
    name: user.name,
    email: user.email,
    role: user.role,
    isSubscribed: user.isSubscribed,
    createdAt: new Date(user.createdAt).toLocaleDateString(),
    isEnable: user.isAble,
    enableUser,
    updateUser,
  }))

  return (
    <MainLayout title='Usuarios' pageDescription='Información de los usuario' titleIcon={<AdminPanelSettings color='info' sx={{ fontSize: '1.5rem' }} />} nextPage='/' url='/'>

      {
        users.length > 0
          ?
          <Grid container className='fadeIn' sx={{ backgroundColor: '#fafafa', borderRadius: '4px' }}>
            <Grid item xs={12} sx={{ height: 660, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
              />
            </Grid>

            <Button className='button' sx={{ mt: 2 }} onClick={getMoreUsers}>Obtener más</Button>
          </Grid>
          : <Typography>No se encontraron usuarios en la base de datos.</Typography>
      }

    </MainLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {

  const session = await getServerSession(ctx.req, ctx.res, nextAuthOptions);

  const validRoles = ['superuser', 'admin'];

  // @ts-ignore
  if (!session || !session.user || !validRoles.includes(session.user.role)) {
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

  const users = await dbUsers.getUsers();

  if (!users) {
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