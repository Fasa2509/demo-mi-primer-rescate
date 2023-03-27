import { NextPage } from 'next';
import { VolunteerActivism } from '@mui/icons-material';
import { Typography } from '@mui/material';

import { AdoptionForm, MainLayout } from '../../../components';

const AdoptarPage: NextPage = () => {
  
  return (
    <MainLayout title={ 'Adopta una mascota' } H1={ 'Adopta aquí' } pageDescription={ 'Proceso de adopción de nuestros animalitos en la fundación Mi Primer Rescate, encuentra tu mascota ideal entre una amplia selección de animales rescatados.' } titleIcon={ <VolunteerActivism color='info' sx={{ fontSize: '1.5rem' }} /> } nextPage='/cambios' url='/adoptar/formulario'>
      
        <Typography>Las mascotas de <b>Mi Primer Rescate</b> tienen algo en común, ¡ninguna te dejará indiferente!. Si quieres una mascota, definitivamente estás en el lugar indicado.</Typography>

        <AdoptionForm />

    </MainLayout>
  )
}

export default AdoptarPage;