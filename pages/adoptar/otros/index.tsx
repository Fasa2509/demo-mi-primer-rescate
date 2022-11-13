import { NextPage } from 'next';
import { VolunteerActivism } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';

import { mprRevalidatePage } from '../../../mprApi';
import { MainLayout, Pet, PetCard } from '../../../components';
import styles from '../../../styles/Adoptar.module.css';

const pets: Pet[] = [
  {
    name: 'Susy',
    story: 'Excepteur sint velit exercitation in sit esse consequat reprehenderit sint exercitation adipisicing laboris dolore tempor. Ex amet amet nulla consequat. Quis deserunt et nulla culpa qui cupidatat ex ad. Sit ad pariatur reprehenderit cupidatat fugiat consectetur. Labore dolor consequat laboris exercitation do duis. Labore duis irure magna in reprehenderit cillum. Enim amet elit velit aute irure enim reprehenderit laborum nisi ullamco occaecat Lorem excepteur minim.',
    image: '/square-dog.jpg',
  },
  {
    name: 'Pirata',
    story: 'Laboris aute aliqua aliqua laborum magna consectetur sunt. Qui eiusmod amet sunt occaecat culpa qui fugiat anim. Mollit anim sint reprehenderit laboris non enim dolor. Aute quis quis elit irure elit laborum eu ipsum consectetur. Nulla ea anim dolor labore officia.',
    image: '/square-dog.jpg',
  },
  {
    name: 'Paco',
    story: 'Ullamco ut Lorem non exercitation reprehenderit nisi adipisicing velit eiusmod reprehenderit nulla cillum eu aliquip. Pariatur quis sint voluptate voluptate veniam laborum cupidatat velit amet sunt nulla eiusmod. Enim veniam Lorem irure do duis proident aliquip ad reprehenderit amet cupidatat consectetur. Aute deserunt anim excepteur fugiat ut elit. Occaecat culpa et cillum excepteur incididunt. Culpa magna consectetur ea dolor. Elit excepteur et excepteur duis.',
    image: '/square-dog.jpg',
  },
  {
    name: 'Lizz',
    story: 'Exercitation amet velit cillum dolor ex esse mollit. Ex qui ad laboris adipisicing dolor minim. Non ullamco in velit exercitation aute aute deserunt proident. Eu aute commodo do laboris commodo consequat aliqua non dolore laborum cupidatat reprehenderit et id.',
    image: '/square-dog.jpg',
  },
  {
    name: 'Benny',
    story: 'Laboris nulla pariatur enim culpa irure consequat deserunt occaecat adipisicing do laboris dolor enim. Do consectetur sit voluptate ex amet anim sunt reprehenderit anim id fugiat. Dolore ex ad quis sunt quis culpa cillum. Velit consectetur sint irure id. Excepteur quis pariatur irure duis excepteur labore.',
    image: '/square-dog.jpg',
  },
  {
    name: 'Zico',
    story: 'Incididunt esse et ea reprehenderit commodo in elit sint. Amet magna sit anim cupidatat eu. Voluptate excepteur id culpa excepteur labore voluptate minim dolor occaecat nulla. Dolor labore enim incididunt non est velit reprehenderit commodo magna laborum.',
    image: '/square-dog.jpg',
  },
]


const AdoptarPage: NextPage = () => {

  const { enqueueSnackbar } = useSnackbar();

  const revalidate = async () => {
    if ( process.env.NODE_ENV !== 'production' ) return;

    const resRev = await mprRevalidatePage('/adoptar/otros');

    enqueueSnackbar(resRev.message, { variant: !resRev.error ? 'success' : 'error' });
  }

  return (
    <MainLayout title={ 'Adopta una mascota' } H1={ 'Adopta una mascota' } pageDescription={ 'Proceso de adopción de nuestros animalitos' } titleIcon={ <VolunteerActivism color='info' sx={{ fontSize: '1.5rem' }} /> } nextPage='/adoptar/formulario'>
      
        <Typography>Las mascotas de <b>Mi Primer Rescate</b> tienen algo en común, ¡ninguna te dejará indiferente!. Si quieres una mascota, definitivamente estás en el lugar indicado.</Typography>

        <div className={ styles.grid__container }>
            {
                pets.map(( pet, index ) => (
                    <PetCard key={ pet.name + index } pet={ pet } />
                ))
            }
        </div>

        <Button variant='contained' color='secondary' sx={{ mt: 2 }} onClick={ revalidate }>Revalidar esta página</Button>

    </MainLayout>
  )
}

export default AdoptarPage;