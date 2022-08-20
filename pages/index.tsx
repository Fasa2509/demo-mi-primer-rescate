import { useEffect, useState } from 'react';
import type { NextPage } from 'next'

import { PetsOutlined } from '@mui/icons-material';
import { Article, CustomForm, MainIndexLayout, Slider } from '../components';
import { IArticle } from '../interfaces';
import styles from '../styles/Home.module.css';

const fadeImages = [
  {
    url: '/perro-1.webp',
    alt: 'Perro 1',
    width: 350,
    height: 350,
  },
  {
    url: '/perro-2.webp',
    alt: 'Perro 2',
    width: 350,
    height: 350,
  },
  {
    url: '/dog-hero-image.webp',
    alt: 'Perro Hero',
    width: 620,
    height: 350,
  },
]

const Home: NextPage = () => {

  const [articles, setArticles] = useState<IArticle[]>([]);

  // TODO: traer notas de la DB
  useEffect(() => {
    // window.localStorage.clear();

    let lastArticles: IArticle[] = JSON.parse( window.localStorage.getItem('articles_2') || '[]' );

    if ( lastArticles.length === 0 ) {
      let templateArticles = [{"title":"Artículo de Ejemplo #3","fields":[{"type":"texto","content":"Ex qui dolore aliqua occaecat non esse non Lorem sint proident officia nisi.\n\nAdipisicing non et incididunt qui ullamco elit in aliqua adipisicing id fugiat sit minim. Exercitation magna ullamco dolore do ut laborum irure est incididunt est. Ullamco ex culpa pariatur irure. Amet irure tempor sunt occaecat officia. Et do quis laboris cupidatat velit incididunt veniam sit ea aliquip sunt est. Consectetur officia sit fugiat sint enim irure et.\n\nLabore dolor eu quis duis elit dolore tempor Lorem commodo aute duis qui cupidatat. Excepteur pariatur adipisicing laborum magna aliqua ullamco exercitation non.","content_":""},{"type":"subtitulo","content":"Esto es un subtítulo","content_":"","width":1,"height":1},{"type":"imagen","content":"","images":[{"url":"/dog-hero-image.webp","alt":"texto","width":1280,"height":720}]}],"createdAt":1660327044162,"articleId":"article-Artículo de Ejemplo #3"},{"title":"Ejemplo 2","fields":[{"type":"texto","content":"Duis ipsum qui occaecat ad in duis voluptate. Tempor eiusmod ea non do. Velit non et proident dolore. Eiusmod dolor occaecat laborum amet nulla incididunt ipsum fugiat eiusmod.\n\nAliqua occaecat velit aute anim non qui aliqua ad veniam. Nulla elit ad ipsum adipisicing adipisicing do aliquip qui culpa minim deserunt consectetur proident.","content_":"","width":1,"height":1},{"type":"imagen","content":"","images":[{"url":"/dog-hero-image.webp","alt":"Texto de ejemplo","width":1280,"height":720},{"url":"/perro-1.webp","alt":"example","width":350,"height":350},{"url":"/perro-2.webp","alt":"text of example","width":350,"height":350}]},{"type":"link","content":"https://www.google.com","content_":"¡Visita Google aquí!","width":1,"height":1},{"type":"texto","content":"Duis ipsum qui occaecat ad in duis voluptate. Tempor eiusmod ea non do. Velit non et proident dolore. Eiusmod dolor occaecat laborum amet nulla incididunt ipsum fugiat eiusmod.","content_":"","width":1,"height":1}],"createdAt":1660327358810,"articleId":"article-Ejemplo 2"},{"title":"Artículo de Ejemplo #1","fields":[{"type":"subtitulo","content":"Subtítulo aquí","content_":"","width":1,"height":1},{"type":"texto","content":"Nisi ut minim qui consectetur nisi do quis. Fugiat sit mollit eu deserunt velit minim deserunt consectetur excepteur excepteur dolore.","content_":"","width":1,"height":1},{"type":"link","content":"https://www.google.com","content_":"Estaremos en la radio YYY.Y FM. Escúchanos aquí","width":1,"height":1},{"type":"subtitulo","content":"El evento será en...","content_":"","width":1,"height":1},{"type":"contador","content":"2022-08-12T14:20","content_":"","width":1,"height":1}],"createdAt":1660327549691,"articleId":"article-Artículo de Ejemplo #1"}];

      window.localStorage.setItem('articles_2', JSON.stringify( templateArticles ));

      lastArticles = templateArticles as IArticle[];
    }

    setArticles( lastArticles );
}, [])

  return (      
    <MainIndexLayout title={ 'Bienvenidos' } H1={ 'Mi Primer Rescate' } pageDescription={ 'Esta es la página oficial de @miprimerrescate, fundación dedicada al rescate y cuidado de animales y personas en situación de calle.' }>

      <Slider style={{ backgroundImage: 'url(/wave-haikei-1.svg), url(/wave-haikei-2.svg)', backgroundPosition: 'bottom left', backgroundSize: 'cover' }}>
        <h2 className={ `slider__element is-active` }>Quiénes somos y qué hacemos <PetsOutlined /></h2>

        <p className={ `slider__element` }>Nuestro equipo de Mi Primer Rescate está formado por un grupo de voluntarios que se dedican a realizar la labor sin ningún fin de lucro</p>
        <p className={ `slider__element` }>Liderada de la mano de Nieves Peña, quien es la fundadora y pionera de este proyecto; la fundación tiene como propósito...</p>
        <p className={ `slider__element` }>Proteger y ayudar a los animales que así lo necesiten</p>
        <p className={ `slider__element` }>Disminuir la sobrepoblación de los peludos en la calle</p>
        <p className={ `slider__element` }>Acobijar a las mascotas abandonadas y en situación de calle</p>
        <p className={ `slider__element` }>Marcar una pauta de respeto y concientización en todo el país, específicamente donde realizamos la labor (Carabobo/ Venezuela) y a donde podamos llegar al rededor del mundo.</p>
      </Slider>
      
      {/* TODO: factorizacion cuando haya superusuarios */}
      <CustomForm />

      <p className={ styles.subtitle }>¿Qué estamos haciendo ahora?</p>

      <section className={ styles.articles__container }>
        {
          articles.map(( article: IArticle, index) => (
            <Article key={ article.title + index } title={ article.title } fields={ article.fields } createdAt={ article.createdAt } />
          ))
        }
      </section>

    </MainIndexLayout>
  )
}

export default Home;
