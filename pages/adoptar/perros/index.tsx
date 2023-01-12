import { useContext, useState, lazy, Suspense } from 'react';
import { NextPage, GetStaticProps } from 'next';
import { VolunteerActivism } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { useSnackbar } from 'notistack';

import { dbPets } from '../../../database';
import { AuthContext, ScrollContext } from '../../../context'
import { mprRevalidatePage } from '../../../mprApi';
import { MainLayout, PetCard } from '../../../components';
import { IPet } from '../../../interfaces';
import styles from '../../../styles/Adoptar.module.css';

const PetForm = lazy(() =>
  import('../../../components/ui/PetForm')
    .then(({ PetForm }) => ({ default: PetForm }))
);

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

    const morePets = await dbPets.getMorePets( date, 'perro', true );
    
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
    const resRev = await mprRevalidatePage('/adoptar/perros');
    setIsLoading( false );

    enqueueSnackbar(resRev.message, { variant: !resRev.error ? 'success' : 'error' });
  }
  
  return (
    <MainLayout title={ 'Adopta un perrito' } H1={ 'Adopta un perrito' } pageDescription={ '¿Buscas adoptar un perrito? Ve los perritos que tenemos en nuestra fundación y adopta uno para llenarlo de amor. Encuentra el ideal para ti aquí entre una amplia selección de animales rescatados.' } titleIcon={ <VolunteerActivism color='info' sx={{ fontSize: '1.5rem' }} /> } nextPage='/adoptar/gatos' url='/adoptar/perros'>
      
        <p>¡Los perritos de <b>Mi Primer Rescate</b> son especiales! Vienen llenos de mucho amor, con dósis extra de cariño y una gran ración de dulzura, ¡busca el tuyo aquí!.</p>

        <div className={ styles.grid__container }>
            {
                pets.map(( pet, index ) => (
                    <PetCard key={ pet.name + index } pet={ pet } removable={ user ? user.role === 'admin' || user.role === 'superuser' : false } />
                ))
            }
        </div>

        <Box display='flex' justifyContent='flex-end' sx={{ paddingRight: { xs: '1rem', md: '2.5rem' } }}>
          <Button className={ styles.load__pets } color='secondary' onClick={ requestPets }>Ver más</Button>
        </Box>

        <>
          { user && ( user.role === 'admin' || user.role === 'superuser' ) &&
            <>
              <Suspense fallback={ <p>Cargando...</p> }>
                <PetForm pet='perro' />
              </Suspense>
              <Button className='fadeIn' variant='contained' color='secondary' sx={{ mt: 2 }} onClick={ revalidate }>Revalidar esta página</Button>
            </>
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
    },
    revalidate: 3600 * 24 * 7,
  }
}

export default AdoptarPage;