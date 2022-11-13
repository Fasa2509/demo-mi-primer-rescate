import { useContext, useState } from 'react';
import type { GetStaticProps, NextPage } from 'next'
import { Button, Link } from '@mui/material';
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
    
    if ( moreArticles ) setArticles([ ...articles, ...moreArticles ]);

    setIsLoading( false );
  }

  const revalidate = async () => {
    if ( process.env.NODE_ENV !== 'production' ) return;

    const resRev = await mprRevalidatePage('/');

    enqueueSnackbar(resRev.message, { variant: !resRev.error ? 'success' : 'error' });
  }

  return (
    <MainIndexLayout title={ 'Mi Primer Rescate' } H1={ 'Mi Primer Rescate' } pageDescription={ 'Esta es la página oficial de @miprimerrescate, fundación dedicada al rescate y cuidado de animales y personas en situación de calle.' } pageImage={ 'Logo-MPR.png' } titleIcon={ <Home color='info' sx={{ fontSize: '1.5rem' }} /> }>
      
      { ( isLoggedIn && user && (user.role === 'superuser' || user.role === 'admin') )
        ? <CustomForm />
        : <></>
      }

      <p className={ styles.subtitle }>¿Qué estamos haciendo ahora?</p>

      <section className={ styles.articles__container }>
        {
          articles.map(( article ) => (
            <Article key={ article._id } article={ article } removable={ true } />
          ))
        }

        <Link color='secondary' alignSelf='flex-end' underline='hover' sx={{ cursor: 'pointer' }} onClick={ requestArticles }>Cargar más...</Link>
      </section>

      <Button variant='contained' color='secondary' sx={{ mt: 2 }} onClick={ revalidate }>Revalidar esta página</Button>

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
