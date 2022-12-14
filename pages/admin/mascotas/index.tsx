import { useContext, useState } from 'react';
import { NextPage, GetServerSideProps } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { Button, CardMedia, Grid, Typography } from '@mui/material';
import { EmojiNature } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
import { format as formatDate } from 'date-fns';
import { nextAuthOptions } from '../../api/auth/[...nextauth]';

import { dbPets } from '../../../database';
import { MainLayout } from '../../../components';
import { ScrollContext } from '../../../context';
import { IPet } from '../../../interfaces';
import { ConfirmNotificationButtons, PromiseConfirmHelper } from '../../../utils';

const columns: GridColDef[] = [
    {
        field: 'image',
        headerName: 'Imagen',
        renderCell: ({ row }: GridRenderCellParams) => {
            return (
              <CardMedia
                component='img'
                className='fadeIn'
                image={ row.image }
                alt={ row.name }
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
            return <Typography sx={{ overflowX: 'auto' }}>{ row.id }</Typography>
        },
        width: 150,
        sortable: false,
        disableColumnMenu: true,
    },
    {
        field: 'userId',
        headerName: 'ID del Usuario',
        renderCell: ({ row }: GridRenderCellParams) => {
            return <Typography sx={{ overflowX: 'auto' }}>{ row.userId }</Typography>
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
            <Typography>{ formatDate( row.createdAt, 'dd/MM/yyyy' ) }</Typography>
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
            return <Button color={ row.isAble ? 'error' : 'success' } onClick={ () => row.handleAbilitate( row.id, row.name, row.isAble ) }>{ row.isAble ? 'Eliminar' : 'Habilitar' }</Button>
        }
    },
];


interface Props {
    pets: IPet[];
}


const PetsPage: NextPage<Props> = ({ pets: Pets }) => {

  const [pets, setPets] = useState( Pets );
  const { enqueueSnackbar } = useSnackbar();
  const { setIsLoading } = useContext( ScrollContext );

  const handleAbilitate = async ( id: string, name: string, isAble: boolean ) => {

    let key = enqueueSnackbar(`??Segur@ que quieres ${ isAble ? 'eliminar' : 'habilitar' } a ${ name }?`, {
        variant: isAble ? 'warning' : 'info',
        autoHideDuration: 10000,
        action: ConfirmNotificationButtons,
    });

    let accepted = await PromiseConfirmHelper(key, 10000);

    if ( !accepted ) return;

    const res = await dbPets.deletePet( id );

    enqueueSnackbar(res.message, { variant: !res.error ? 'success' : 'error' });

    if ( !res.error ) setPets( pets.map(( pet ) => pet._id === id ? { ...pet, isAble: !isAble } : pet) );

  }

  const rows = pets.map(( pet ) => ({
    image: pet.images[0],
    id: pet._id,
    userId: pet.userId,
    type: pet.type,
    name: pet.name,
    createdAt: pet.createdAt,
    isAble: pet.isAble,
    handleAbilitate,
  }));

  return (
    <MainLayout title='Mascotas' pageDescription='Informaci??n de las mascotas' titleIcon={ <EmojiNature color='info' sx={{ fontSize: '1.5rem' }} /> } nextPage='/' url='/'>

      {
        pets.length > 0
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
          : <Typography variant='h2'>No se encontraron ??rdenes en la base de datos.</Typography>
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

  const pets = await dbPets.getAllPets();

  if ( !pets ) {
    ctx.req.cookies = {
      mpr__notification: JSON.stringify({
        notificationMessage: 'Ocurri?? un error obteniendo las ??rdenes',
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