import { FC, useEffect, useContext, lazy, Suspense } from 'react';
import Head from 'next/head';
import { Box } from '@mui/material';
import Carousel from 'react-material-ui-carousel';

import { AuthContext } from '../../context';
import { Footer, Header, SideMenu, Title, WelcomePath } from '../ui';
import { MyImage, Slider } from '../cards';
import { Loader } from './Loader';
import { IIndexImage } from '../../interfaces';
import styles from './MainLayout.module.css';

const HeroForm = lazy(() =>
  import('../cards/HeroForm')
    .then(({ HeroForm }) => ({ default: HeroForm }))
)

const callback: IntersectionObserverCallback = ( entries ) =>
  ( entries[0]!.isIntersecting )
    ? entries[0].target.classList.remove('sticks__inactive')
    : entries[0].target.classList.add('sticks__inactive') 

interface Props {
  children: JSX.Element | JSX.Element[];
  title: string;
  H1?: string;
  pageDescription: string;
  titleIcon: JSX.Element;
  nextPage?: string;
  indexImages: IIndexImage[];
}

export const MainIndexLayout: FC<Props> = ({ children, title, H1, pageDescription, titleIcon, nextPage = '/miprimerrescate', indexImages }) => {

  const { user } = useContext( AuthContext );

  let finalTitle = `${ title } | MPR`;

  useEffect(() => {
    const observer = new IntersectionObserver(callback, {
        rootMargin: '0px 0px -96% 0px',
        threshold: 0,
    });

    observer.observe( document.getElementById('sticks')! );
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = () => {
    window.scrollTo({
      behavior: 'smooth',
      top: 0,
    })
  }

  return (
    <>
      <Head>
        <title>{ finalTitle }</title>

        <meta name="description" content={ pageDescription } />
        
        <meta property="og:title" content={ title } />
        <meta property="og:site_name" content='Blog Mi Primer Rescate' />
        <meta property="og:description" content={ pageDescription } />
        <meta property="og:image" content={ `${ process.env.NEXT_PUBLIC_DOMAIN_NAME }/Logo-Redes.png` } />
        <meta property="og:url" content={ process.env.NEXT_PUBLIC_DOMAIN_NAME } />
      </Head>

      <Header />

      <SideMenu />

      <Loader />
      
      <section style={{ minWidth: '310px', backgroundColor: 'green' }}>
        <Slider identifier='hero-slider' duration={ 12000 }>
          {
            indexImages.map(({ url, alt }, index) => 
            <Box key={ index } sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', aspectRatio: '16/9' }}>
                <Box sx={{ position: 'relative', display: 'block', width: '100%' }}>
                  <MyImage src={ url } alt={ alt } layout='responsive' width={ 1280 } height={ 720 } />
                </Box>
            </Box>
            )
          }
        </Slider>
      </section>

      {
        user && ( user.role === 'admin' || user.role === 'superuser' ) &&
        <Suspense fallback={ <></> }>
          <HeroForm images={ indexImages } />
        </Suspense>
      }

      <WelcomePath />
      
      <div className={ styles.phrases__container }>
          <Carousel interval={ 8000 }>
            <div className={ styles.phrase }>
              <blockquote className={ styles.phrase__text }>“La compasión por los animales se conecta tan exactamente con la bondad del carácter, que se puede afirmar con seguridad que quien es cruel con los animales, no puede ser un buen hombre.”</blockquote>
              <p className={ styles.phrase__autor }>Arthur Schopenhauer</p>
            </div>
            <div className={ styles.phrase }>
              <blockquote className={ styles.phrase__text }>“Hasta que no hayas amado a un animal, una parte de tu alma permanecerá dormida.”</blockquote>
              <p className={ styles.phrase__autor }>Anatole France</p>
            </div>
            <div className={ styles.phrase }>
              <blockquote className={ styles.phrase__text }>“Quien alimenta a un animal hambriento, alimenta su propia alma.”</blockquote>
              <p className={ styles.phrase__autor }>Charles Chaplin</p>
            </div>
            <div className={ styles.phrase }>
              <blockquote className={ styles.phrase__text }>“Si los perros no van al cielo, cuando muera quiero ir a donde ellos van.”</blockquote>
              <p className={ styles.phrase__autor }>Will Rogers</p>
            </div>
          </Carousel>
      </div>
      
      <main className={ styles.main__container }>
        <Title title={ H1 || title } nextPage={ nextPage } index>
          { titleIcon }
        </Title>

        { children }
      </main>

      <button className={ styles.scroll__button } onClick={ handleClick }></button>

      <Footer />
    </>
  )
}
