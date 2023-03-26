import { FC } from 'react';
import Head from "next/head";

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
  url: string;
}

export const MainLayout: FC<Props> = ({ children, title, H1, pageDescription, pageImage = '/Logo-MPR.png', titleIcon, nextPage, url }) => {

  let finalTitle = `${ title } | MPR`;

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
        <meta property="og:description" content={ pageDescription } />
        <meta property="og:image" content={ `${ process.env.NEXT_PUBLIC_DOMAIN_NAME }${ pageImage || '/Logo-MPR.png' }` } />
        <meta property="og:url" content={ `${ process.env.NEXT_PUBLIC_DOMAIN_NAME }${ url }` } />
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

      <button className={ styles.scroll__button } onClick={ handleClick }></button>

      <Footer />
    </>
  )
}
