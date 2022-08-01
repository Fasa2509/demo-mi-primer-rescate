import React, { FC, useContext } from 'react'
import { useRouter } from 'next/router';
import Link from 'next/link'

import { ScrollContext } from '../../context';
import styles from './Navbar.module.css'
import { Header } from './Header';

const slugs = [
  {
    name: 'Inicio',
    slug: '/'
  },
  {
    name: 'Proyecto MPR',
    slug: '/miprimerrescate'
  },{
    name: 'Apoyo',
    slug: '/apoyo'
  },{
    name: 'Adoptar',
    slug: '/adoptar'
  },{
    name: 'Cambios',
    slug: '/cambios'
  },{
    name: 'Tienda',
    slug: '/tienda'
  },
]

export const NavbarIndex: FC = () => {

  const { scrolled, passedImage } = useContext( ScrollContext );

  return (
    <>
    <Header />
    {/* si ya se hace hecho scroll, le agrega la clase scrolled que hace que se reduzca su height */}
    {/* <nav className={ `${styles.navbar}${ scrolled ? ` ${ styles['navbar--scrolled'] }` : '' }${ !passedImage ? ` ${styles.navbar__index}` : '' }` }>
      
      <div className={ styles.navbar__routes }>
        {
          slugs.map( (item) => (
            <Link key={ item.slug } href={ item.slug }>
              <a className={
                ( item.slug === '/' )
                  ? ( !passedImage )
                    ? styles.navbar__route__index__active
                    : styles.navbar__route__active
                  : ''
              }>
                { item.name }
              </a>
            </Link>
          ))
        }
      </div>
      
    </nav> */}
    </>
  )
}
