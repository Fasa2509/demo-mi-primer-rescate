import { FC, useContext, useEffect } from 'react';
import Head from "next/head";
import { useSession, getSession } from 'next-auth/react';
import { useSnackbar } from 'notistack';
import Cookies from 'js-cookie';
import { isToday, isTomorrow } from 'date-fns';

import { ScrollContext } from "../../context";
import { Footer, Header, SideMenu, Title } from "../ui";
import { Loader } from "./Loader";
import { ConfirmNotificationButtons } from '../../utils';
import styles from './MainLayout.module.css'

interface Props {
  children: JSX.Element | JSX.Element[];
  title: string;
  H1?: string;
  pageDescription: string;
  pageImage?: string;
  titleIcon: JSX.Element;
  nextPage: string;
}

export const MainLayout: FC<Props> = ({ children, title, H1, pageDescription, pageImage, titleIcon, nextPage }) => {

  let finalTitle = `${ title } | MPR`;

  const { data: session, status } = useSession();
  const { passedElements, isLoading } = useContext( ScrollContext );
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
        new Promise(( resolve, reject ) => {
          let key = enqueueSnackbar('Tu sesión está a punto de expirar, ¿quieres extenderla?', {
              variant: 'info',
              autoHideDuration: 15000,
              action: ConfirmNotificationButtons,
          })

          let timer = setTimeout(() => reject(callback), 15000);

          const callback = ( e: any ) => {
              if ( e.target.matches(`.accept.n${ key.toString().replace('.', '') } *`) ) {
                  resolve({
                      accepted: true,
                      callback,
                      timer,
                  })
              }

              if ( e.target.matches(`.deny.n${ key.toString().replace('.', '') } *`) ) {
                  resolve({
                      accepted: false,
                      callback,
                      timer,
                  })
              }
          }

          document.addEventListener('click', callback);
      })
      // @ts-ignore
      .then(({ accepted, callback, timer }: { accepted: boolean, callback: any, timer: any }) => {
          document.removeEventListener('click', callback);
          clearTimeout( timer );

          if ( !accepted ) {
            Cookies.set('mpr__extendSession', 'false');
            return;
          }

          getSession();

          return;
      })
      .catch(({ callback }: { callback: any }) => {
          document.removeEventListener('click', callback);
      })
      }
    }
}, [session, status, enqueueSnackbar])

  return (
    <>
      <Head>
        <title>{ finalTitle }</title>

        <meta name="description" content={ pageDescription } />
        <meta name="og:title" content={ title } />
        <meta name="og:description" content={ pageDescription } />

        <meta name="og:image" content={ pageImage ? `https://demo-mi-primer-rescate.vercel.app/${ pageImage }` : 'https://demo-mi-primer-rescate.vercel.app/Logo-Redes.png' } />
      </Head>

      <Header index={ false } shop={ false } />

      <SideMenu />

      <Loader />
      
      <main className={ styles.main__container }>
        {/* <h1 className={ styles.title }>{ H1 || title }</h1> */}
        <Title title={ H1 || title } nextPage={ nextPage }>
          { titleIcon }
        </Title>

        {/* <Divider sx={{ margin: '.4rem 0 .7rem' }} /> */}

        { children }
      </main>

      <button className={ 'scroll__button ' + styles.scroll__button + `${ passedElements.includes('.scroll__button') ? ` ${styles['scroll__button--scrolled']}` : '' }` } onClick={ handleClick }></button>

      <Footer />
    </>
  )
}












/*
import { FC, MouseEventHandler, useContext } from "react"

import Head from "next/head";

import { Footer, Header, HeroWelcome, SideMenu } from "../ui";
import { ScrollContext } from "../../context";
import styles from './MainLayout.module.css'
import { Divider } from "@mui/material";
import { useRouter } from "next/router";
import { ColorSelector } from './ColorSelector';

interface Props {
  children: JSX.Element | JSX.Element[];
  title: string;
  H1?: string;
  pageDescription: string;
}

export const MainLayout: FC<Props> = ({ children, title, H1, pageDescription }) => {

  let finalTitle = `${ title } | MPR`

  const router = useRouter();
  const { scrolled } = useContext( ScrollContext )

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

        {/* TODO: meta og:image }
        </Head>

        <ColorSelector />
  
        <SideMenu />
  
        <Header index={ router.pathname === '/' } />
  
        { router.pathname === '/' && <HeroWelcome /> }
        
        <main className={ styles.main__container }>
          <h1 style={{ margin: 0, fontWeight: 500 }}>{ H1 || title }</h1>
  
          <Divider sx={{ margin: '.8rem 0 1rem' /*{ xs: '.5rem 0', md: '1rem 0' } }} />
  
          { children }
        </main>
  
        <button className={ `${styles.scroll__button}${ scrolled ? ` ${styles['scroll__button--scrolled']}` : '' }` } onClick={ handleClick }></button>
  
        <Footer />
  
      </>
    )
  }
  
*/