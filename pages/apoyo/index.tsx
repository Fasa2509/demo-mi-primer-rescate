import { NextPage } from 'next';
import { Typography } from '@mui/material';
import { AddAlert } from '@mui/icons-material';

import { MainLayout } from '../../components';

const ApoyoPage: NextPage = () => {
  
  return (
    <MainLayout title={ 'Cómo ayudar' } pageDescription={ '¿Te preguntas cómo ayudarnos a cumplir con nuestra labor? Pues es muy fácil. Conoce los detalles aquí.' } titleIcon={ <AddAlert color='info' sx={{ fontSize: '1.5rem' }} /> } nextPage='/adoptar/perros' url='/apoyo'>

        <Typography>Página de Apoyo</Typography>

    </MainLayout>
  )
}

export default ApoyoPage;