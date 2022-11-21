import { useContext } from 'react';
import { NextPage, GetStaticProps } from 'next';
import { VolunteerActivism } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';

import { dbPets } from '../../../database';
import { AuthContext, ScrollContext } from '../../../context'
import { mprRevalidatePage } from '../../../mprApi';
import { MainLayout, PetCard } from '../../../components';
import { IPet } from '../../../interfaces';
import styles from '../../../styles/Adoptar.module.css';

interface Props {
  pets: IPet[];
}

const AdoptarPage: NextPage<Props> = ({ pets }) => {

  const { user } = useContext( AuthContext );
  const { setIsLoading } = useContext( ScrollContext );
  const { enqueueSnackbar } = useSnackbar();
  
  const revalidate = async () => {
    if ( process.env.NODE_ENV !== 'production' ) return;

    setIsLoading( true );
    const resRev = await mprRevalidatePage('/adoptar/perros');
    setIsLoading( false );

    enqueueSnackbar(resRev.message, { variant: !resRev.error ? 'success' : 'error' });
  }
  
  return (
    <MainLayout title={ 'Adopta un perrito' } H1={ 'Adopta un perrito' } pageDescription={ 'Proceso de adopción de nuestros animalitos' } titleIcon={ <VolunteerActivism color='info' sx={{ fontSize: '1.5rem' }} /> } nextPage='/adoptar/gatos'>
      
        <p>¡Los perritos de <b>Mi Primer Rescate</b> son especiales! Vienen rellenos de mucho amor, con dósis extra de cariño y una gran ración de dulzura, ¡busca el tuyo aquí!.</p>

        <div className={ styles.grid__container }>
            {
                pets.map(( pet, index ) => (
                    <PetCard key={ pet.name + index } pet={ pet } />
                ))
            }
        </div>

        <>
          { user && ( user.role === 'admin' || user.role === 'superuser' ) &&
            <Button className='fadeIn' variant='contained' color='secondary' sx={{ mt: 2 }} onClick={ revalidate }>Revalidar esta página</Button>
          }
        </>

    </MainLayout>
  )
};

export const getStaticProps: GetStaticProps = async ( ctx ) => {

  const pets = await dbPets.getAllTypePets( 'perro' );

  if ( !pets ) throw new Error('Ocurrió un error buscando las mascotas en la DB');

  return {
    props: {
      pets
    }
  }
}

export default AdoptarPage;