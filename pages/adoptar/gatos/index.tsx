import { useContext, useState } from 'react';
import { NextPage, GetStaticProps } from 'next';
import { VolunteerActivism } from '@mui/icons-material';
import { Box, Button, Link, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';

import { dbPets } from '../../../database';
import { AuthContext, ScrollContext } from '../../../context';
import { mprRevalidatePage } from '../../../mprApi';
import { MainLayout, PetCard, PetForm } from '../../../components';
import { IPet } from '../../../interfaces';
import styles from '../../../styles/Adoptar.module.css';

interface Props {
  pets: IPet[];
}

const AdoptarPage: NextPage<Props> = ({ pets: Pets }) => {

  const { user } = useContext( AuthContext );
  const { setIsLoading } = useContext( ScrollContext );
  const { enqueueSnackbar } = useSnackbar();
  const [pets, setPets] = useState( Pets );

  const requestPets = async () => {
    setIsLoading( true );

    let date = pets.at(-1) ? pets.at(-1)!.createdAt : 0;

    if ( date === 0 ) return enqueueSnackbar('No se encontraron más máscotas', { variant: 'info' });

    const morePets = await dbPets.getMorePets( date, 'gato', true );
    
    if ( ( morePets instanceof Array && morePets.length > 0 ) ) {
      setPets([...pets, ...morePets]);
    } else {
      enqueueSnackbar('No se encontraron más máscotas', { variant: 'info' });
    }

    setIsLoading( false );
  }

  const revalidate = async () => {
    if ( process.env.NODE_ENV !== 'production' ) return;

    setIsLoading( true );
    const resRev = await mprRevalidatePage('/adoptar/gatos');
    setIsLoading( false );

    enqueueSnackbar(resRev.message, { variant: !resRev.error ? 'success' : 'error' });
  }

  return (
    <MainLayout title={ 'Adopta un gatito' } H1={ 'Adopta un gatito' } pageDescription={ 'Proceso de adopción de nuestros animalitos' } titleIcon={ <VolunteerActivism color='info' sx={{ fontSize: '1.5rem' }} /> } nextPage='/adoptar/otros'>
      
        <p>¡Los gatitos de <b>Mi Primer Rescate</b> no son como otros! Ell@s están preparados para cualquier muestra de afecto, entrenados para hacerte reír y son expertos en ser consentidos, ¡no te quedes sin el tuyo!.</p>

        <div className={ styles.grid__container }>
            {
                pets.map(( pet, index ) => (
                    <PetCard key={ pet.name + index } pet={ pet } removable={ user ? user.role === 'admin' || user.role === 'superuser' : false } />
                ))
            }
        </div>

        <Box display='flex' justifyContent='flex-end' sx={{ paddingRight: { xs: '1rem', md: '2.5rem' } }}>
          <Link className={ styles.load__pets } color='secondary' alignSelf='flex-end' onClick={ requestPets }>Ver más</Link>
        </Box>

        <>
          { user && ( user.role === 'admin' || user.role === 'superuser' ) &&
            <>
              <PetForm pet='gato' />
              <Button className='fadeIn' variant='contained' color='secondary' sx={{ mt: 2 }} onClick={ revalidate }>Revalidar esta página</Button>
            </>
          }
        </>

    </MainLayout>
  )
}

export const getStaticProps: GetStaticProps = async ( ctx ) => {

  const pets = await dbPets.getAllTypePets( 'gato' );

  if ( !pets ) throw new Error('Ocurrió un error buscando las mascotas en la DB');

  return {
    props: {
      pets
    },
    revalidate: 3600 * 24 * 7,
  }
}

export default AdoptarPage;