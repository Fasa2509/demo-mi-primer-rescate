import { useState } from "react";
import { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { LocalCafe } from "@mui/icons-material"
import { nextAuthOptions } from "../../api/auth/[...nextauth]";
import { dbAdoptions } from "../../../database";
import { MainLayout, OrderInfo } from "../../../components";
import { IAdoption } from "../../../interfaces";
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Button, Grid, Typography } from "@mui/material";
import { AdminAdoptionInfo } from "../../../components/ui/AdminAdoptionInfo";

interface Props {
  adoptions: IAdoption[];
}

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'ID',
    renderCell: ({ row }: GridRenderCellParams) => {
      return (
        <Typography sx={{ overflowX: 'auto' }}>{ row.id }</Typography>
      )
    },
    sortable: false,
    disableColumnMenu: true,
    width: 150,
  },
  {
    field: 'user',
    headerName: 'Usuario',
    renderCell: ({ row }: GridRenderCellParams) => {
      return (
        <Typography sx={{ overflowX: 'auto' }}>{ row.user }</Typography>
        )
      },
      sortable: false,
      disableColumnMenu: true,
      width: 150,
    },
  {
    field: 'cachorro',
    headerName: 'Cachorro',
    renderCell: ({ row }: GridRenderCellParams) => {
      return (
        <Typography>{ row.cachorro ? 'Sí' : 'No' }</Typography>
        )
    },
    align: 'center',
    disableColumnMenu: true,
  },
  {
    field: 'setAdoption',
    headerName: 'Ver info',
    renderCell: ({ row }: GridRenderCellParams) => {
      return <Button color='secondary' onClick={ () => row.setAdoption( row.adoption ) }>Ver info</Button>
    },
    sortable: false,
    disableColumnMenu: true,
  },
  { field: 'createdAt', headerName: 'Creada el', width: 150, disableColumnMenu: true },
]

const adoptionInitialState: IAdoption = {
  _id: '',
  user: '',
  particular1: '',
  particular2: '',
  contact: {
    facebook: '',
    instagram: '',
    whatsapp: '',
  },
  input1: '',
  input2: '',
  input3: true,
  input4: '',
  input5: '',
  input6: true,
  input7: true,
  input8: '',
  input9: '',
  input10: true,
  input11: '',
  input12: true,
  input13: '',
  input14: true,
  input15: '',
  input16: '',
  input17: '',
  input18: '',
  input19: 0,
  input20: 0,
  input21: true,
  input22: '',
  input23: '',
  cachorro: true,
  input24: '',
  input25: '',
  input26: true,
  input27: true,
  input28: '',
  createdAt: 0,
}

const AdopcionesPage: NextPage<Props> = ({ adoptions }) => {

  const [adoption, setAdoption] = useState( adoptionInitialState );

  const rows = adoptions.map(adoption => ({
    id: adoption._id,
    user: adoption.user,
    cachorro: adoption.cachorro,
    createdAt: new Date( adoption.createdAt ).toLocaleDateString(),
    adoption,
    setAdoption,
  }));

  return (
    <MainLayout title='Adopciones' pageDescription='Información de las adopciones' titleIcon={ <LocalCafe color='info' sx={{ fontSize: '1.5rem' }} /> } nextPage='/' url='/'>

      {
        adoptions.length > 0
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
          : <Typography variant='h2'>No se encontraron adopciones en la base de datos.</Typography>
      }

      <>
      { adoption._id && <AdminAdoptionInfo adoption={ adoption } /> }
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

  const adoptions = await dbAdoptions.getAllAdoptions();

  if ( !adoptions ) {
    ctx.req.cookies = {
      mpr__notification: JSON.stringify({
        notificationMessage: 'Ocurrió un error obteniendo las adopciones',
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
      adoptions,
    }
  }
}

export default AdopcionesPage;