import { useContext } from 'react';
import type { GetStaticProps, NextPage } from 'next'
import { Home } from '@mui/icons-material';

import { Article, CustomForm, MainIndexLayout } from '../components';
import { IArticle } from '../interfaces';
import { AuthContext } from '../context';
import { dbArticles } from '../database';
import styles from '../styles/Home.module.css';

interface Props {
  articles: IArticle[];
}

const HomePage: NextPage<Props> = ({ articles }) => {

  const { isLoggedIn, user } = useContext( AuthContext );

  return (
    <MainIndexLayout title={ 'Bienvenid@' } H1={ 'Mi Primer Rescate' } pageDescription={ 'Esta es la página oficial de @miprimerrescate, fundación dedicada al rescate y cuidado de animales y personas en situación de calle.' } pageImage={ 'Logo-MPR.png' } titleIcon={ <Home color='info' sx={{ fontSize: '1.5rem' }} /> }>
      
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
      </section>

    </MainIndexLayout>
  )
}

export const getStaticProps: GetStaticProps = async ( ctx ) => {
  
  const articles: IArticle[] | null = await dbArticles.getAllArticles();

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
