import { useContext, useState, lazy, Suspense } from 'react';
import type { GetStaticProps, NextPage } from 'next'
import { useSnackbar } from 'notistack';
import { Box, Button, Link } from '@mui/material';
import Home from '@mui/icons-material/Home';
import Facebook from '@mui/icons-material/Facebook';
import Instagram from '@mui/icons-material/Instagram';
import Twitter from '@mui/icons-material/Twitter';
import WhatsApp from '@mui/icons-material/WhatsApp';

import { mprRevalidatePage } from '../mprApi';
import { Article, MainIndexLayout } from '../components';
import { IArticle, IIndexImage } from '../interfaces';
import { AuthContext, ScrollContext } from '../context';
import { dbArticles, dbImages } from '../database';
import styles from '../styles/Home.module.css';

const CustomForm = lazy(() =>
  import('../components/ui/CustomForm')
    .then(({ CustomForm }) => ({ default: CustomForm }))
);

interface Props {
  articles: IArticle[];
  indexImages: IIndexImage[];
}

const HomePage: NextPage<Props> = ({ articles: myArticles, indexImages }) => {

  const { isLoggedIn, user } = useContext(AuthContext);
  const { setIsLoading } = useContext(ScrollContext);
  const [articles, setArticles] = useState<IArticle[]>(myArticles);
  const { enqueueSnackbar } = useSnackbar();

  const requestArticles = async () => {
    setIsLoading(true);

    const moreArticles = await dbArticles.getMoreArticles(articles.at(-1)?.createdAt || 0);

    if ((moreArticles instanceof Array && moreArticles.length > 0)) {
      setArticles([...articles, ...moreArticles])
    } else {
      enqueueSnackbar('No se encontraron más artículos', { variant: 'info' });
    }

    setIsLoading(false);
  }

  const share = async () => {
    try {
      await navigator.share({
        title: '¡Visita la página de Mi Primer Rescate!',
        text: 'Mira su trabajo y participa en sus eventos',
        url: `${process.env.NEXT_PUBLIC_DOMAIN_NAME}`,
      });
    } catch (error) {
      enqueueSnackbar('No se pudo compartir', { variant: 'warning' });
    }
  }

  const revalidate = async () => {
    if (process.env.NODE_ENV !== 'production') return;

    setIsLoading(true);
    const resRev = await mprRevalidatePage('/');
    setIsLoading(false);

    enqueueSnackbar(resRev.message, { variant: !resRev.error ? 'success' : 'error' });
  }

  return (
    <MainIndexLayout indexImages={indexImages} title={'Fundación Mi Primer Rescate'} H1={'Mi Primer Rescate'} pageDescription={'Esta es la página oficial de @miprimerrescate, fundación dedicada al rescate y cuidado de animales y personas en situación de calle. Buscamos mejorar la calidad de vida de los animales que rescatamos asignándoles un hogar.'} titleIcon={<Home color='info' sx={{ fontSize: '1.5rem' }} />}>

      <>
        {(isLoggedIn && user && (user.role === 'superuser' || user.role === 'admin')) && <Suspense fallback={<p>Cargando...</p>}><CustomForm /></Suspense>}
      </>

      <article className='content-island'>
        <Box sx={{ my: 1.5 }}>
          <p className={styles.p}>¡Apóyanos en <Link href='https://www.patreon.com/' underline='always' target='_blank' rel='noreferrer'>Patreon</Link> o comparte nuestras redes para llegar a más personas! Aún queda mucho por hacer.</p>
          <div className={styles.share__container}>
            <Link href={`https://www.facebook.com/sharer.php?u=${process.env.NEXT_PUBLIC_DOMAIN_NAME}&t=¡Visita la página de Mi Primer Rescate!`} target='_blank' rel='noreferrer' className={`${styles.share__button} ${styles.facebook}`}><Facebook color='info' sx={{ fontSize: '1.5rem' }} /></Link>
            <button className={`${styles.share__button} ${styles.instagram}`} onClick={share}><Instagram color='info' sx={{ fontSize: '1.5rem' }} /></button>
            <Link href={`https://twitter.com/intent/tweet?text=¡Visita la página de Mi Primer Rescate!&url=${process.env.NEXT_PUBLIC_DOMAIN_NAME}`} target='_blank' rel='noreferrer' className={`${styles.share__button} ${styles.twitter}`}><Twitter color='info' sx={{ fontSize: '1.5rem' }} /></Link>
            <Link href={`https://api.whatsapp.com/send?text=¡Visita la página de Mi Primer Rescate! ${process.env.NEXT_PUBLIC_DOMAIN_NAME}`} target='_blank' rel='noreferrer' className={`${styles.share__button} ${styles.whatsapp}`}><WhatsApp color='info' sx={{ fontSize: '1.5rem' }} /></Link>
          </div>
        </Box>
      </article>

      <Box display='flex' flexWrap='wrap' gap='1.5rem' flexDirection='column' sx={{ my: 6 }}>
        <Box sx={{ display: 'flex', gap: '1rem', flexDirection: { xs: 'column', sm: 'row' } }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', maxHeight: '8rem', borderRadius: '.3rem', padding: '1.8rem 1.5rem', color: '#fff', flexGrow: 1, flexBasis: '320px', backgroundImage: 'url(dog-hero-image-2.jpg)', backgroundSize: 'cover', backgroundPosition: '0% 50%' }}>
            <p className={styles.cards__title}>Ayúdanos</p>
            <p className={styles.cards__content}>Los animales nos necesitan</p>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', maxHeight: '8rem', borderRadius: '.3rem', padding: '1.8rem 1.5rem', color: '#fff', flexGrow: 1, flexBasis: '320px', backgroundImage: 'url(dog-hero-image.webp)', backgroundSize: 'cover', backgroundPosition: '0% 35%' }}>
            <p className={styles.cards__title}>Participa en la fundación</p>
            <p className={styles.cards__content}>Asiste a nuestros eventos</p>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: '1rem', flexDirection: { xs: 'column', sm: 'row' } }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', maxHeight: '8rem', borderRadius: '.3rem', padding: '1.8rem 1.5rem', color: '#fff', flexGrow: 1, flexBasis: '320px', backgroundImage: 'url(cat-hero-image.jpg)', backgroundSize: 'cover', backgroundPosition: '0% 70%' }}>
            <p className={styles.cards__title}>Dona</p>
            <p className={styles.cards__content}>Tu aporte nos ayuda a seguir</p>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', maxHeight: '8rem', borderRadius: '.3rem', padding: '1.8rem 1.5rem', color: '#fff', flexGrow: 1, flexBasis: '320px', backgroundImage: 'url(dog-hero-image-3.jpg)', backgroundSize: 'cover', backgroundPosition: '0% 10%' }}>
            <p className={styles.cards__title}>Cuida a tus mascotas</p>
            <p className={styles.cards__content}>Trátalas con el amor que ellas te dan</p>
          </Box>
        </Box>
      </Box>

      <p className={styles.subtitle}>¿Qué estamos haciendo ahora?</p>

      <section className={styles.articles__container}>
        {
          articles.map((article) => (
            <Article key={article._id} article={article} removable={user && (user.role === 'superuser' || user.role === 'admin')} />
          ))
        }

        <Button className={styles.load__articles} color='secondary' onClick={requestArticles}>Ver más</Button>
      </section>

      <>
        {user && (user.role === 'admin' || user.role === 'superuser') &&
          <Button className='fadeIn' variant='contained' color='secondary' sx={{ mt: 2 }} onClick={revalidate}>Revalidar esta página</Button>
        }
      </>

    </MainIndexLayout>
  )
}

export const getStaticProps: GetStaticProps = async (ctx) => {

  let articles = await dbArticles.getAllArticles();

  if (!articles) throw new Error("Error trayendo los artículos de la página");

  let indexSections = await dbImages.getIndexSections();

  // if (!indexSections || indexSections.sections.length < 1) throw new Error("Error trayendo las imágenes de inicio de la página");
  if (!indexSections || indexSections.sections.length < 1) indexSections = { _id: '', sections: [] };

  const indexImages = indexSections.sections;

  return {
    props: {
      articles,
      indexImages,
    }
  }
}

export default HomePage;
