import { FC, lazy, Suspense } from 'react';
import Head from 'next/head';
import Carousel from 'react-material-ui-carousel';

import { Footer, Header, SideMenu, Title, WelcomePath } from '../ui';
import { MyImage } from '../cards';
import { Loader } from './Loader';
import styles from './MainLayout.module.css';

// const Footer = lazy(() =>
//   import('../ui/Footer')
//     .then(({ Footer }) => ({ default: Footer }))
// );

interface Props {
  children: JSX.Element | JSX.Element[];
  title: string;
  H1?: string;
  pageDescription: string;
  titleIcon: JSX.Element;
  nextPage?: string;
}

export const MainIndexLayout: FC<Props> = ({ children, title, H1, pageDescription, titleIcon, nextPage = '/miprimerrescate' }) => {

  let finalTitle = `${ title } | MPR`;
  // const { passedElements } = useContext( ScrollContext );

  console.log('mainindexlayout')

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
        <meta name="og:title" content={ title } />
        <meta name="og:description" content={ pageDescription } />
        <meta name="og:image" content={ 'https://demo-mi-primer-rescate.vercel.app/Logo-Redes.png' } />

      </Head>

      <Header />

      <SideMenu />

      <Loader />
      
      <section style={{ width: '100%' }}>
        <Carousel indicators={ false } autoPlay duration={ 650 } interval={ 12000 }>
        <div style={{ height: 'calc(100vw / calc(16 / 9))', backgroundColor: 'red', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '50%' }}>
            <MyImage priority src={ '/Logo-Redes.png' } alt={ 'Mi Primer Rescate' } layout='responsive' width={ 1 } height={ 1 } />
          </div>
        </div>
        <div style={{ height: 'calc(100vw / calc(16 / 9))', backgroundColor: 'green', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '50%' }}>
            <MyImage priority src={ '/Logo-MPR.png' } alt={ 'Mi Primer Rescate Logo' } layout='responsive' width={ 1 } height={ 1 } />
          </div>
        </div>
        <div style={{ height: 'calc(100vw / calc(16 / 9))', backgroundColor: 'blue' }}></div>
        </Carousel>
      </section>

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
        <Title title={ H1 || title } nextPage={ nextPage }>
          { titleIcon }
        </Title>

        { children }
      </main>

      <button className={ styles.scroll__button } onClick={ handleClick }></button>

      {/* <Suspense fallback={ <></> }> */}
        <Footer />
      {/* </Suspense> */}
    </>
  )
}
