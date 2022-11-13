import { NextPage } from 'next';
import { VolunteerActivism } from '@mui/icons-material';
import { Typography } from '@mui/material';

import { AdoptionForm, ContentSlider, MainLayout, ModalWindow, Pet, PetCard } from '../../../components';
import styles from '../../../styles/Adoptar.module.css';

const AdoptarPage: NextPage = () => {
  
  return (
    <MainLayout title={ 'Adopta una mascota' } H1={ 'Adopta aquí' } pageDescription={ 'Proceso de adopción de nuestros animalitos' } titleIcon={ <VolunteerActivism color='info' sx={{ fontSize: '1.5rem' }} /> } nextPage='/cambios'>
      
        <Typography>Las mascotas de <b>Mi Primer Rescate</b> tienen algo en común, ¡ninguna te dejará indiferente!. Si quieres una mascota, definitivamente estás en el lugar indicado.</Typography>

        <AdoptionForm />

    </MainLayout>
  )
}

export default AdoptarPage;