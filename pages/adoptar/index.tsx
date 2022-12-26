import { NextPage } from 'next';
import { Typography } from '@mui/material';
import { VolunteerActivism } from '@mui/icons-material';

import { MainLayout } from '../../components';

const AdoptarPage: NextPage = () => {

  return (
    <MainLayout title={ 'Adopción' } H1={ 'Adopta' } pageDescription={ 'Proceso de adopción de mascotas en la fundación Mi Primer Rescate.' } titleIcon={ <VolunteerActivism color='info' sx={{ fontSize: '1.5rem' }} /> } nextPage='/cambios'>
      
        <Typography>Página de adopción</Typography>

    </MainLayout>
  )
}

export default AdoptarPage;