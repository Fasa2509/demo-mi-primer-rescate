import { useContext, useState, lazy, Suspense } from 'react';
import { NextPage, GetStaticProps } from 'next';
import NextLink from 'next/link';
import { useSnackbar } from 'notistack';
import { Box, Button, Link } from '@mui/material';
import VolunteerActivism from '@mui/icons-material/VolunteerActivism';

import { dbPets } from '../../../database';
import { AuthContext, ScrollContext } from '../../../context';
import { mprRevalidatePage } from '../../../mprApi';
import { MainLayout, PetCard } from '../../../components';
import { IPet } from '../../../interfaces';
import styles from '../../../styles/Adoptar.module.css';

const callback: IntersectionObserverCallback = (entries) =>
  entries.forEach((entry) =>
    (entry.isIntersecting)
      ? entry.target.classList.add(styles.pet__focused)
      : entry.target.classList.remove(styles.pet__focused)
  );

const PetForm = lazy(() =>
  import('../../../components/ui/PetForm')
    .then(({ PetForm }) => ({ default: PetForm }))
);

interface Props {
  pets: IPet[];
}

const AdoptarPage: NextPage<Props> = ({ pets: Pets }) => {

  const { user } = useContext(AuthContext);
  const { setIsLoading } = useContext(ScrollContext);
  const { enqueueSnackbar } = useSnackbar();
  const [pets, setPets] = useState(Pets);


  const requestPets = async () => {
    setIsLoading(true);

    let date = pets.at(-1) ? pets.at(-1)!.createdAt : 0;

    if (date === 0) return enqueueSnackbar('No se encontraron más máscotas', { variant: 'info' });

    const morePets = await dbPets.getMorePets(date, 'perro', true);

    if ((morePets instanceof Array && morePets.length > 0)) {
      setPets([...pets, ...morePets]);
    } else {
      enqueueSnackbar('No se encontraron más máscotas', { variant: 'info' });
    }

    setIsLoading(false);
  }

  const revalidate = async () => {
    if (process.env.NODE_ENV !== 'production') return;

    setIsLoading(true);
    const resRev = await mprRevalidatePage('/adoptar/perros');
    setIsLoading(false);

    enqueueSnackbar(resRev.message, { variant: !resRev.error ? 'success' : 'error' });
  }

  return (
    <MainLayout title={'Adopta un perrito'} H1={'Adopta un perrito'} pageDescription={'¿Buscas adoptar un perrito? Ve los perritos que tenemos en nuestra fundación y adopta uno para llenarlo de amor. Encuentra el ideal para ti aquí entre una amplia selección de animales rescatados.'} titleIcon={<VolunteerActivism color='info' sx={{ fontSize: '1.5rem' }} />} nextPage='/adoptar/gatos' url='/adoptar/perros'>

      <section className='content-island'>
        <p>En este apartado puedes conocer la historia de cada peludo en adopción, si estás interesado en alguno, llena el apartado de <NextLink href='/adoptar/formulario' passHref><Link sx={{ textDecoration: 'underline', color: 'var(--secondary-color-2)' }}>formulario</Link></NextLink>.</p>
      </section>

      <div className={styles.grid__container}>
        {
          pets.map((pet, index) => (
            <PetCard key={pet.name + index} pet={pet} removable={user ? user.role === 'admin' || user.role === 'superuser' : false} />
          ))
        }
      </div>

      <Box display='flex' justifyContent='flex-end' sx={{ paddingRight: { xs: '1rem', md: '2.5rem' } }}>
        <Button className={styles.load__pets} color='secondary' onClick={requestPets}>Ver más</Button>
      </Box>

      <>
        {user && (user.role === 'admin' || user.role === 'superuser') &&
          <>
            <Suspense fallback={<p>Cargando...</p>}>
              <PetForm pet='perro' />
            </Suspense>
            <Button className='fadeIn' variant='contained' color='secondary' sx={{ mt: 2 }} onClick={revalidate}>Revalidar esta página</Button>
          </>
        }
      </>

    </MainLayout>
  )
};

export const getStaticProps: GetStaticProps = async (ctx) => {

  const pets = await dbPets.getAllTypePets('perro');

  if (!pets) throw new Error('Ocurrió un error buscando las mascotas en la DB');

  return {
    props: {
      pets
    },
  }
}

export default AdoptarPage;