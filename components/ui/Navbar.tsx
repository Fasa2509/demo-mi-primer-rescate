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

export const Navbar: FC = () => {

  const { scrolled } = useContext( ScrollContext );
  const router = useRouter();


  return (
    <>
    <Header />
    {/* si ya se hace hecho scroll, le agrega la clase scrolled que hace que se reduzca su height */}
    {/* <nav className={ `${styles.navbar}${ scrolled ? ` ${ styles['navbar--scrolled'] }` : '' }` }>
      
      <div className={ styles.navbar__routes }>
        {
          slugs.map( (item) => (
            <Link key={ item.slug } href={ item.slug }>
              <a className={ ( router.asPath === item.slug ) ? styles.navbar__route__active : '' }>
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
