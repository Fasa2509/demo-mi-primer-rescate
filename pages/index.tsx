import { useContext, useState } from 'react';
import type { GetStaticProps, NextPage } from 'next'
import { Box, Button } from '@mui/material';
import { Home } from '@mui/icons-material';

import { mprRevalidatePage } from '../mprApi';
import { Article, CustomForm, MainIndexLayout } from '../components';
import { IArticle } from '../interfaces';
import { AuthContext, ScrollContext } from '../context';
import { dbArticles } from '../database';
import styles from '../styles/Home.module.css';
import { useSnackbar } from 'notistack';

interface Props {
  articles: IArticle[];
}

const HomePage: NextPage<Props> = ({ articles: myArticles }) => {

  const { isLoggedIn, user } = useContext( AuthContext );
  const { setIsLoading } = useContext( ScrollContext );
  const [articles, setArticles] = useState<IArticle[]>( myArticles );
  const { enqueueSnackbar } = useSnackbar();

  const requestArticles = async () => {
    setIsLoading( true );
    
    const moreArticles = await dbArticles.getMoreArticles( articles.at(-1)?.createdAt || 0 );
    
    if ( ( moreArticles instanceof Array && moreArticles.length > 0 ) ) {
      setArticles([ ...articles, ...moreArticles ])
    } else {
      enqueueSnackbar('No se encontraron más artículos', { variant: 'info' });
    }

    setIsLoading( false );
  }

  const revalidate = async () => {
    if ( process.env.NODE_ENV !== 'production' ) return;

    setIsLoading( true );
    const resRev = await mprRevalidatePage('/');
    setIsLoading( false );

    enqueueSnackbar(resRev.message, { variant: !resRev.error ? 'success' : 'error' });
  }

  return (
    <MainIndexLayout title={ 'Mi Primer Rescate' } H1={ 'Mi Primer Rescate' } pageDescription={ 'Esta es la página oficial de @miprimerrescate, fundación dedicada al rescate y cuidado de animales y personas en situación de calle.' } titleIcon={ <Home color='info' sx={{ fontSize: '1.5rem' }} /> }>
      
      <>
      { ( isLoggedIn && user && (user.role === 'superuser' || user.role === 'admin') ) && <CustomForm /> }
      </>

      <Box display='flex' flexWrap='wrap' gap='2rem' justifyContent='center' sx={{ my: 4 }}>
        <Box sx={{ padding: '1rem', color: '#fff', width: 'max(45%, 280px)', backgroundImage: 'url(dog-hero-image.webp)', backgroundSize: 'cover', backgroundPosition: '0% 50%' }}>
          <p className={ styles.cards__title }>Ayúdanos</p>
          <p className={ styles.cards__content }>Los animales nos esperan</p>
        </Box>
        <Box sx={{ padding: '1rem', color: '#fff', width: 'max(45%, 280px)', backgroundImage: 'url(dog-hero-image.webp)', backgroundSize: 'cover', backgroundPosition: '0% 35%' }}>
          <p className={ styles.cards__title }>Participa en la fundación</p>
          <p className={ styles.cards__content }>Asiste a nuestros eventos</p>
        </Box>
        <Box sx={{ padding: '1rem', color: '#fff', width: 'max(45%, 280px)', backgroundImage: 'url(dog-hero-image.webp)', backgroundSize: 'cover', backgroundPosition: '0% 70%' }}>
          <p className={ styles.cards__title }>Dona</p>
          <p className={ styles.cards__content }>Tu aporte nos ayuda a seguir</p>
        </Box>
        <Box sx={{ padding: '1rem', color: '#fff', width: 'max(45%, 280px)', backgroundImage: 'url(dog-hero-image.webp)', backgroundSize: 'cover', backgroundPosition: '0% 10%' }}>
          <p className={ styles.cards__title }>Cuida a tus mascotas</p>
          <p className={ styles.cards__content }>Trátalas con el amor que ellas te dan</p>
        </Box>
      </Box>

      <p className={ styles.subtitle }>¿Qué estamos haciendo ahora?</p>

      <section className={ styles.articles__container }>
        {
          articles.map(( article ) => (
            <Article key={ article._id } article={ article } removable={ user && ( user.role === 'superuser' || user.role === 'admin' )  } />
          ))
        }

        <Button className={ styles.load__articles } color='secondary' onClick={ requestArticles }>Ver más</Button>
      </section>

      <>
          { user && ( user.role === 'admin' || user.role === 'superuser' ) &&
            <Button className='fadeIn' variant='contained' color='secondary' sx={{ mt: 2 }} onClick={ revalidate }>Revalidar esta página</Button>
          }
      </>

    </MainIndexLayout>
  )
}

export const getStaticProps: GetStaticProps = async ( ctx ) => {
  
  const articles = await dbArticles.getAllArticles();

  if ( !articles ) {
    throw new Error("Failed to fetch articles, check server's logs");
  }

  return {
    props: {
      articles: JSON.parse( JSON.stringify( articles ) ),
    }
  }
}

export default HomePage;
