import { useContext, useEffect, useState } from 'react';
import type { NextPage } from 'next'
import { PetsOutlined } from '@mui/icons-material';

import { FormArticle, MainIndexLayout, Slider } from '../components';
import styles from '../styles/Home.module.css'
import { Article } from '../components/ui/Article';
import { AuthContext } from '../context';

interface article {
  title: string;
  content: string;
  createdAt: number;
}

const Home: NextPage = () => {

  const { isLoggedIn } = useContext( AuthContext );
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    let arts = JSON.parse( window.localStorage.getItem('articles') || '[]' )

    setArticles( arts )
  }, [])

  return (      
    <MainIndexLayout title={ 'Bienvenidos' } H1={ 'Mi Primer Rescate' } pageDescription={ 'Esta es la página oficial de @miprimerrescate. Aquí podrás encontrar información referente a la fundación.' }>
      
      <Slider style={{ backgroundImage: 'url(/blob-scene-haikei.svg)', backgroundSize: 'cover', margin: '1.5rem 0' }}>
        <h2 className={ `slider__element is-active` }>Quiénes somos y qué hacemos <PetsOutlined /></h2>

        <p className={ `slider__element` }>Nuestro equipo de Mi Primer Rescate está formado por un grupo de voluntarios que se dedican a realizar la labor sin ningún fin de lucro</p>
        <p className={ `slider__element` }>Liderada de la mano de Nieves Peña, quien es la fundadora y pionera de este proyecto; la fundación tiene como propósito...</p>
        <p className={ `slider__element` }>Proteger y ayudar a los animales que así lo necesiten</p>
        <p className={ `slider__element` }>Disminuir la sobrepoblación de los peludos en la calle</p>
        <p className={ `slider__element` }>Acobijar a las mascotas abandonadas y en situación de calle</p>
        <p className={ `slider__element` }>Marcar una pauta de respeto y concientización en todo el país, específicamente donde realizamos la labor (Carabobo/ Venezuela) y a donde podamos llegar al rededor del mundo.</p>
      </Slider>
      
      { isLoggedIn ? <FormArticle /> : <></> }

      <p className={ styles.subtitle }>¿Qué estamos haciendo ahora?</p>
      <section className={ styles.articles__container }>
        {
          articles.map(( article: article, index) => (
            <Article key={ article.title + index } article={ article } />
          ))
        }
      </section>

    </MainIndexLayout>
  )
}

export default Home;
