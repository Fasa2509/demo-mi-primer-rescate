import { useContext, useEffect, useState } from 'react';
import { GetStaticProps, NextPage } from 'next'
import { TrendingUp } from '@mui/icons-material';
import { Button, Link } from '@mui/material';
import { useSnackbar } from 'notistack';

import { dbPets } from '../../database';
import { AuthContext, ScrollContext } from '../../context';
import { mprRevalidatePage } from '../../mprApi';
import { ChangeCard, MainLayout, PetChangeForm } from '../../components'
import { IPet } from '../../interfaces';
import styles from '../../styles/Cambios.module.css'

const callback = ( entries: any ) => 
  entries.forEach(( entry: any ) => entry.isIntersecting && entry.target.classList.add(`${ styles.visible }`));

interface Props {
  pets: IPet[];
  changedPets: IPet[];
}

const CambiosPage: NextPage<Props> = ({ pets: a, changedPets: b }) => {

  const { user } = useContext( AuthContext );
  const { setIsLoading } = useContext( ScrollContext );
  const { enqueueSnackbar } = useSnackbar();

  const [pets, setPets] = useState( a );
  const [changedPets, setChangedPets] = useState( b );

  useEffect(() => {
    const observer = new IntersectionObserver(callback, {
      threshold: 0.25,
    });

    document.querySelectorAll('.observe').forEach(( a ) => observer.observe( a ));
  }, []);

  const requestPets = async ( isAdmin: boolean ) => {
    setIsLoading( true );

    const date = ( isAdmin )
      ? pets.at(-1)?.createdAt || 0
      : changedPets.at(-1)?.createdAt || 0

    const morePets = await dbPets.getMorePets( date, 'cambios', isAdmin );
    
    if ( ( morePets instanceof Array && morePets.length > 0 ) ) {
      isAdmin && setPets([...pets, ...morePets]);
      isAdmin || setChangedPets([...changedPets, ...morePets]);
    } else {
      enqueueSnackbar('No se encontraron más máscotas', { variant: 'info' });
    }

    setIsLoading( false );
  }
  
  const revalidate = async () => {
    if ( process.env.NODE_ENV !== 'production' ) return;

    setIsLoading( true );
    const resRev = await mprRevalidatePage('/cambios');
    setIsLoading( false );

    enqueueSnackbar(resRev.message, { variant: !resRev.error ? 'success' : 'error' });
  }
  
  return (
    <MainLayout title={ 'Cambios de nuestros amigos' } H1={ 'Antes y después' } pageDescription={ 'Aquí podrás ver el antes y después de nuestros amigos peludos. Algunos han pasado por mucho, pero con amor, esfuerzo y trabajo, han recuperado una vida digna.' } titleIcon={ <TrendingUp color='info' sx={{ fontSize: '1.5rem' }} /> } nextPage='/tienda'>
        
      <p>¡La evolución y mejora de nuestros amigos!</p>
        
      <p>Sint veniam aliquip incididunt labore pariatur. Lorem ipsum culpa sit consectetur. Eiusmod ad magnaunt esse adipisicing quis incididunt adipisicing voluptate commodo minim exercitation. Velit nulla cupidatat culpa irure Lorem non ut nulla ex nulla et in occaecat.</p>

      <section className={ styles.changes__section }>
        {
          pets.map(( pet, index ) => <ChangeCard key={ index } pet={ pet } observe={ pets.length === 6 } />)
        }

        <Link className={ styles.load__pets } color='secondary' alignSelf='flex-end' onClick={ () => requestPets( true ) }>Ver más</Link>
      </section>

      <section className={ styles.section }>
        <p className={ styles.title }>¿Has adoptado una mascota? ¿Cómo fue tu experiencia?</p>

        <p>Nos interesa compartir con el mundo la experiencia de los adoptantes para concientizar acerca de la importancia de darle un hogar a todos peludos.</p>
      
        <PetChangeForm />
      </section>

      <section className={ styles.changes__section }>
          <p className={ styles.changes__title }>¡Algunas experiencias de nuestros seguidores!</p>

          {
            changedPets.map(( pet, index ) => <ChangeCard key={ index } pet={ pet } />)
          }

        <Link className={ styles.load__pets } color='secondary' alignSelf='flex-end' onClick={ () => requestPets( false ) }>Ver más</Link>
      </section>

      <>
        { user && ( user.role === 'admin' || user.role === 'superuser' ) &&
          <Button className='fadeIn' variant='contained' color='secondary' sx={{ mt: 2 }} onClick={ revalidate }>Revalidar esta página</Button>
        }
      </>

    </MainLayout>
  )
};

export const getStaticProps: GetStaticProps = async ( ctx ) => {

  const pets = await dbPets.getAllTypePets( 'cambios' );

  if ( !pets ) throw new Error('Ocurrió un error obteniendo las mascotas de la DB');
  
  const changedPets = await dbPets.getChangedPets();
  
  if ( !changedPets ) throw new Error('Ocurrió un error obteniendo los cambios de la DB');
  
  return {
    props: {
      pets,
      changedPets,
    },
    revalidate: 3600 * 24 * 3,
  }
} 

export default CambiosPage;