import { FC, useContext, useEffect } from 'react';
import Head from "next/head";
import Image from "next/image"
import { useSession, getSession } from "next-auth/react";
import Carousel from "react-material-ui-carousel";
import Cookies from 'js-cookie';

import { Footer, Header, SideMenu, Title, WelcomePath } from "../ui";
import { SliderHero } from "../slider";
import { ScrollContext } from "../../context";
import { Loader } from "./Loader";
import { isToday, isTomorrow } from 'date-fns';
import { useSnackbar } from 'notistack';
import { ConfirmNotificationButtons, PromiseConfirmHelper } from '../../utils';
import styles from './MainLayout.module.css'

interface Props {
  children: JSX.Element | JSX.Element[];
  title: string;
  H1?: string;
  pageDescription: string;
  pageImage: string;
  titleIcon: JSX.Element;
  nextPage?: string;
}

export const MainIndexLayout: FC<Props> = ({ children, title, H1, pageDescription, pageImage, titleIcon, nextPage = '/miprimerrescate' }) => {

  let finalTitle = `${ title } | MPR`;
  const { data: session, status } = useSession();
  const { passedElements } = useContext( ScrollContext );
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = () => {
    window.scrollTo({
      behavior: 'smooth',
      top: 0,
    })
  }

  useEffect(() => {
        console.log(session)
        if ( session ) {
          if ( Cookies.get('mpr__extendSession') === 'true' && isToday( new Date(session.expires) ) || isTomorrow( new Date(session.expires) )) {
            (async () => {
              let key = enqueueSnackbar('Tu sesión está a punto de expirar, ¿quieres extenderla?', {
                  variant: 'info',
                  autoHideDuration: 15000,
                  action: ConfirmNotificationButtons,
              })

                const confirm = await PromiseConfirmHelper( key, 15000 );
                
                if ( !confirm ) {
                  Cookies.set('mpr__extendSession', 'false');
                  return;
                }

                getSession();
    
                return;
              })();
            }
          }
  }, [session, status, enqueueSnackbar])

  return (
    <>
      <Head>
        <title>{ finalTitle }</title>

        <meta property="description" content={ pageDescription } />
        <meta property="og:title" content={ title } />
        <meta property="og:description" content={ pageDescription } />

        <meta property="og:image" content={ 'https://demo-mi-primer-rescate.vercel.app/Logo-Redes.png' } />

        <meta name="og:title" content={ title } />
        <meta name="og:description" content={ pageDescription } />

        <meta name="og:image" content={ 'https://demo-mi-primer-rescate.vercel.app/Logo-Redes.png' } />
      </Head>

      <Header index />

      <SideMenu />

      <Loader />

      <SliderHero>
        <div style={{ height: 'calc(100vw / calc(16 / 9))', backgroundColor: 'red', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '50%' }}>
            <Image priority src={ '/Logo-Redes.png' } alt={ 'Mi Primer Rescate' } layout='responsive' width={ 1 } height={ 1 } />
          </div>
        </div>
        <div style={{ height: 'calc(100vw / calc(16 / 9))', backgroundColor: 'green', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: '50%' }}>
            <Image src={ '/Logo-MPR.png' } alt={ 'Mi Primer Rescate Logo' } layout='responsive' width={ 1 } height={ 1 } />
          </div>
        </div>
        <div style={{ height: 'calc(100vw / calc(16 / 9))', backgroundColor: 'blue' }}></div>
      </SliderHero>

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
        {/* <h1 className={ styles.title }>{ H1 || title }</h1> */}
        <Title title={ H1 || title } nextPage={ nextPage }>
          { titleIcon }
        </Title>

        {/* <Divider sx={{ margin: '.4rem 0 .7rem' }} /> */}

        { children }
      </main>

      <button className={ 'scroll__button ' + styles.scroll__button + `${ passedElements.includes( '.scroll__button' ) ? ` ${styles['scroll__button--scrolled']}` : '' }` } onClick={ handleClick }></button>

      <Footer />
    </>
  )
}
