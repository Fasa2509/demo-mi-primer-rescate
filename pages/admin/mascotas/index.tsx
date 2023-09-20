import { useContext, useState } from 'react';
import { NextPage, GetServerSideProps } from 'next';
import { getServerSession } from "next-auth/next";
import { Button, CardMedia, Grid, Typography } from '@mui/material';
import EmojiNature from '@mui/icons-material/EmojiNature';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
import { format as formatDate } from 'date-fns';
import { nextAuthOptions } from '../../api/auth/[...nextauth]';

import { dbPets } from '../../../database';
import { MainLayout } from '../../../components';
import { ScrollContext } from '../../../context';
import { IPet } from '../../../interfaces';
import { ConfirmNotificationButtons, PromiseConfirmHelper } from '../../../utils';
import { getPaginatedPets } from '../../../database/dbPets';

const columns: GridColDef[] = [
  {
    field: 'image',
    headerName: 'Imagen',
    renderCell: ({ row }: GridRenderCellParams) => {
      return (
        <CardMedia
          component='img'
          className='fadeIn'
          image={row.image}
          alt={row.name}
        />
      )
    },
    sortable: false,
    disableColumnMenu: true
  },
  {
    field: 'id',
    headerName: 'ID de la Mascota',
    renderCell: ({ row }: GridRenderCellParams) => {
      return <Typography sx={{ overflowX: 'auto' }}>{row.id}</Typography>
    },
    width: 150,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: 'userId',
    headerName: 'ID del Usuario',
    renderCell: ({ row }: GridRenderCellParams) => {
      return <Typography sx={{ overflowX: 'auto' }}>{row.userId}</Typography>
    },
    width: 150,
    sortable: false,
    disableColumnMenu: true
  },
  {
    width: 150,
    field: 'name',
    headerName: 'Nombre',
    sortable: false,
  },
  {
    field: 'type',
    headerName: 'Tipo',
    sortable: false,
  },
  {
    field: 'createdAt',
    headerName: 'Creada el',
    renderCell: ({ row }: GridRenderCellParams) => (
      <Typography>{formatDate(row.createdAt, 'dd/MM/yyyy')}</Typography>
    ),
    disableColumnMenu: true,
    width: 110,
  },
  {
    field: 'isAble',
    headerName: 'Habilitada',
    sortable: false,
    disableColumnMenu: true,
    renderCell: ({ row }: GridRenderCellParams) => {
      return <Button className={`button button--round low--padding low--font--size ${row.isAble ? 'button--error' : 'button--success'}`} onClick={() => row.handleAbilitate(row.id, row.name, row.isAble)}>{row.isAble ? 'Eliminar' : 'Habilitar'}</Button>
    }
  },
];


interface Props {
  pets: IPet[];
}


const PetsPage: NextPage<Props> = ({ pets: Pets }) => {

  const [pets, setPets] = useState(Pets);
  const [page, setPage] = useState(1);
  const { enqueueSnackbar } = useSnackbar();
  const { setIsLoading } = useContext(ScrollContext);

  const handleAbilitate = async (id: string, name: string, isAble: boolean) => {

    let key = enqueueSnackbar(`¿Segur@ que quieres ${isAble ? 'eliminar' : 'habilitar'} a ${name}?`, {
      variant: isAble ? 'warning' : 'info',
      autoHideDuration: 10000,
      action: ConfirmNotificationButtons,
    });

    let accepted = await PromiseConfirmHelper(key, 10000);

    if (!accepted) return;

    setIsLoading(true);
    const res = await dbPets.deletePet(id);
    setIsLoading(false);

    enqueueSnackbar(res.message, { variant: !res.error ? 'success' : 'error' });

    if (!res.error) setPets(pets.map((pet) => pet._id === id ? { ...pet, isAble: !isAble } : pet));

  }

  const rows = pets.map((pet) => ({
    image: pet.images[0],
    id: pet._id,
    userId: pet.userId,
    type: pet.type,
    name: pet.name,
    createdAt: pet.createdAt,
    isAble: pet.isAble,
    handleAbilitate,
  }));

  const getMorePets = async () => {
    setIsLoading(true);
    const res = await getPaginatedPets(page);
    setIsLoading(false);

    if (res.error) return enqueueSnackbar(res.message, { variant: 'error', autoHideDuration: 7000 });

    if (res.payload) {
      if (res.payload.pets.length > 0) {
        setPets((prev) => [...prev, ...res.payload!.pets])
        setPage((prevState) => prevState + 1);
      } else {
        enqueueSnackbar(res.message, { variant: 'info', autoHideDuration: 7000 });
      }
    }
  }

  return (
    <MainLayout title='Mascotas' pageDescription='Información de las mascotas' titleIcon={<EmojiNature color='info' sx={{ fontSize: '1.5rem' }} />} nextPage='/' url='/'>

      {
        pets.length > 0
          ? <Grid container className='fadeIn' sx={{ backgroundColor: '#fafafa', borderRadius: '4px' }}>
            <Grid item xs={12} sx={{ height: 660, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
              />
            </Grid>

            <Button className='button' sx={{ mt: 2 }} onClick={getMorePets}>Obtener más</Button>
          </Grid>
          : <Typography variant='h2'>No se encontraron órdenes en la base de datos.</Typography>
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

  const pets = await dbPets.getAllPets();

  if (!pets) {
    ctx.req.cookies = {
      mpr__notification: JSON.stringify({
        notificationMessage: 'Ocurrió un error obteniendo las mascotas',
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
      pets,
    }
  }
}

export default PetsPage;