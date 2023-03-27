import { NextPage } from 'next';
import { Typography } from '@mui/material';
import VolunteerActivism from '@mui/icons-material/VolunteerActivism';

import { MainLayout } from '../../components';

const AdoptarPage: NextPage = () => {

  return (
    <MainLayout title={ 'Adopción' } H1={ 'Adopta' } pageDescription={ 'Proceso de adopción de mascotas en la fundación Mi Primer Rescate. Envia tu solicitud para adoptar cualquiera de nuestros animales rescatados y nos pondremos en contacto contigo a la brevedad posible.' } titleIcon={ <VolunteerActivism color='info' sx={{ fontSize: '1.5rem' }} /> } nextPage='/cambios' url='/adoptar'>
      
        <Typography>Página de adopción</Typography>

    </MainLayout>
  )
}

export default AdoptarPage;