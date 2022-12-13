import { FC, useContext } from 'react';
import Head from "next/head";

import { ScrollContext } from "../../context";
import { Footer, Header, SideMenu, Title } from "../ui";
import { Loader } from "./Loader";
import styles from './MainLayout.module.css';

interface Props {
  children: JSX.Element | JSX.Element[];
  title: string;
  H1?: string;
  pageDescription: string;
  pageImage?: string;
  titleIcon: JSX.Element;
  nextPage: string;
}

export const MainLayout: FC<Props> = ({ children, title, H1, pageDescription, pageImage = '/Logo-MPR.png', titleIcon, nextPage }) => {

  let finalTitle = `${ title } | MPR`;

  const { passedElements } = useContext( ScrollContext );

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
        <meta name="og:image" content={ `https://demo-mi-primer-rescate.vercel.app${ pageImage ? pageImage : '/Logo-MPR.png' }` } />

      </Head>

      <Header />

      <SideMenu />

      <Loader />
      
      <main className={ styles.main__container }>
        <Title title={ H1 || title } nextPage={ nextPage }>
          { titleIcon }
        </Title>

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