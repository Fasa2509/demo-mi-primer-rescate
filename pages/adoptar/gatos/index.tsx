import { useContext, useEffect, useRef, useState, lazy, Suspense } from 'react';
import { NextPage, GetStaticProps } from 'next';
import { VolunteerActivism } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { useSnackbar } from 'notistack';

import { dbPets } from '../../../database';
import { AuthContext, ScrollContext } from '../../../context';
import { mprRevalidatePage } from '../../../mprApi';
import { MainLayout, PetCard } from '../../../components';
import { IPet } from '../../../interfaces';
import styles from '../../../styles/Adoptar.module.css';

const callback: IntersectionObserverCallback = ( entries ) =>
  entries.forEach(( entry ) =>
    ( entry.isIntersecting )
      ? entry.target.classList.add( styles.pet__focused )
      : entry.target.classList.remove( styles.pet__focused )  
    );

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
  const intersectionObserverRef = useRef<IntersectionObserver>( null );
  const lastPetsLengthRef = useRef<number>( 0 );
  const [pets, setPets] = useState( Pets );
  
  useEffect(() => {
    if ( window.innerWidth < 700 ) {
      const observer = new IntersectionObserver(callback, {
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0,
      });

      const allPets = document.querySelectorAll('.observe');

      allPets.forEach(( el ) => observer.observe( el ));

      // @ts-ignore
      intersectionObserverRef.current = observer;
      lastPetsLengthRef.current = allPets.length;

      return () => observer.disconnect();
    }
  }, []);


  useEffect(() => {
    if ( window.innerWidth < 700 ) {
      if ( pets.length <= 6 ) return;

      document.querySelectorAll('.observe')
        .forEach(( el, index ) => ( index >= lastPetsLengthRef.current! ) && intersectionObserverRef.current!.observe( el ));
      
      lastPetsLengthRef.current = pets.length;
    }
  }, [pets]);


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
    <MainLayout title={ 'Adopta un gatito' } H1={ 'Adopta un gatito' } pageDescription={ '¿Buscas adoptar un gatito? Ve los gatitos que tenemos en nuestra fundación y adopta uno para llenarlo de amor. Encuentra el ideal para ti aquí entre una amplia selección de animales rescatados.' } titleIcon={ <VolunteerActivism color='info' sx={{ fontSize: '1.5rem' }} /> } nextPage='/adoptar/otros' url='/adoptar/gatos'>
      
        <section className='content-island'>
          <p>¡Los gatitos de <b>Mi Primer Rescate</b> no son como otros! Ell@s están preparados para cualquier muestra de afecto, entrenados para hacerte reír y son expertos en ser consentidos, ¡no te quedes sin el tuyo!.</p>
        </section>

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
                <PetForm pet='gato' />
              </Suspense>
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