import { FC, lazy, Suspense } from 'react';
import Head from "next/head";

import { Header, SideMenu, Title } from "../ui";
import { Loader } from "./Loader";
import styles from './ShopLayout.module.css'

const Footer = lazy(() =>
  import('../ui/Footer')
    .then(({ Footer }) => ({ default: Footer }))
);

interface Props {
  children: JSX.Element | JSX.Element[];
  title: string;
  H1?: string;
  pageDescription: string;
  pageImage?: string;
  titleIcon?: JSX.Element;
  nextPage?: string;
  url: string;
}

export const ShopLayout: FC<Props> = ({ children, title, H1, pageDescription, pageImage, titleIcon, nextPage, url }) => {

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
        <meta name="og:title" content={ title } />
        <meta name="og:description" content={ pageDescription } />
        <meta name="og:image" content={ `https://demo-mi-primer-rescate.vercel.app${ pageImage ? pageImage : '/Logo-Redes.png' }` } />
        <meta name="og:url" content={ `https://demo-mi-primer-rescate.vercel.app${ url }` } />
      
        <meta property="og:title" content={ title } />
        <meta property="og:description" content={ pageDescription } />
        <meta property="og:image" content={ `https://demo-mi-primer-rescate.vercel.app${ pageImage ? pageImage : '/Logo-Redes.png' }` } />
        <meta property="og:url" content={ `https://demo-mi-primer-rescate.vercel.app${ url }` } />
      
      </Head>

      <Header shop />

      <SideMenu />

      <Loader />

      <main className={ styles.main__container }>
        {
          nextPage &&
          <Title title={ H1 || title } nextPage={ nextPage } style={{ left: '1.5rem' }}>
            { titleIcon! }
          </Title>
        }
        
        { children }
      </main>

      <button className={ styles.scroll__button } onClick={ handleClick }></button>

      <Footer />
    </>
  )
}
