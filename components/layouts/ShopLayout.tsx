import { FC, useContext, useEffect } from 'react';
import Head from "next/head";
import { getSession, useSession } from 'next-auth/react';
import { useSnackbar } from 'notistack';
import { isToday, isTomorrow } from 'date-fns';
import Cookies from 'js-cookie';

import { Footer, Header, SideMenu, Title } from "../ui";
import { ScrollContext } from "../../context";
import { Loader } from "./Loader";
import { ContainerFavProduct } from "../shop";
import { initialFavProducts } from '../../interfaces'
import { ConfirmNotificationButtons, PromiseConfirmHelper } from '../../utils';
import styles from './ShopLayout.module.css'
import { Box } from '@mui/material';

interface Props {
  children: JSX.Element | JSX.Element[];
  title: string;
  H1?: string;
  pageDescription: string;
  pageImage?: string;
  titleIcon?: JSX.Element;
  nextPage?: string;
  main?: boolean;
}

export const ShopLayout: FC<Props> = ({ children, title, H1, pageDescription, pageImage, titleIcon, nextPage, main = false }) => {

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
      if ( Cookies.get('mpr__extendSession') === 'true' && ( isToday( new Date(session.expires) ) || isTomorrow( new Date(session.expires) ) )) {
        (async () => {

          let key = enqueueSnackbar('Tu sesión está a punto de expirar, ¿quieres extenderla?', {
            variant: 'info',
            autoHideDuration: 10000,
            action: ConfirmNotificationButtons,
          })

          const confirm = await PromiseConfirmHelper( key, 10000 );
       
          if ( !confirm ) {
            Cookies.set('mpr__extendSession', 'false');
            return;
          }

          getSession();

        })();
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

        <meta name="og:image" content={ pageImage ? `http://localhost:3000/${ pageImage }` : 'http://localhost:3000/Logo-MPR.png' } />
      </Head>

      <Header shop />

      <SideMenu />

      <Loader />

      {/* { main && <ContainerFavProduct initialFavProducts={ initialFavProducts } /> } */}
      
      <main className={ styles.main__container }>
        {
          nextPage &&
          <Title title={ H1 || title } nextPage={ nextPage } style={{ left: '1.5rem' }}>
            { titleIcon! }
          </Title>
        }
        
        { children }
      </main>

      {
        nextPage &&
        <button className={ 'scroll__button' + ` ${styles.scroll__button}${ passedElements.includes('.scroll__button') ? ` ${styles['scroll__button--scrolled']}` : '' }` } onClick={ handleClick }></button>
      }

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