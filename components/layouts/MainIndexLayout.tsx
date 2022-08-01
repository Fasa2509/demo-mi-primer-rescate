import { FC, useContext } from "react"
import Head from "next/head";

import { Divider } from "@mui/material";

import { ScrollContext } from "../../context";
import { Footer, Header, HeroWelcome, SideMenu } from "../ui";
import { ColorSelector } from './ColorSelector';
import styles from './MainLayout.module.css'

interface Props {
  children: JSX.Element | JSX.Element[];
  title: string;
  H1?: string;
  pageDescription: string;
}

export const MainIndexLayout: FC<Props> = ({ children, title, H1, pageDescription }) => {

  let finalTitle = `${ title } | MPR`

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

        {/* TODO: meta og:image */}
      </Head>

      <ColorSelector />

      <SideMenu />

      <Header index />

      <HeroWelcome />
      
      <main className={ styles.main__container }>
        <h1 className={ styles.title }>{ H1 || title }</h1>

        <Divider sx={{ margin: '.8rem 0 1rem' /*{ xs: '.5rem 0', md: '1rem 0' }*/ }} />

        { children }
      </main>

      <button className={ `${styles.scroll__button}${ scrolled ? ` ${styles['scroll__button--scrolled']}` : '' }` } onClick={ handleClick }></button>

      <Footer />

    </>
  )
}
