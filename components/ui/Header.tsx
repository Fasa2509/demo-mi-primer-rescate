import { FC, useContext } from 'react';
import { MenuContext, ScrollContext } from '../../context';

import { LinkLogo } from './LinkLogo'
import styles from './Navbar.module.css'

interface Props {
  index: boolean;
}

export const Header: FC<Props> = ({ index }) => {

  const { isMenuOpen, toggleSideMenu } = useContext( MenuContext );
  const { passedImage } = useContext( ScrollContext );

  return (
    <nav className={ `${ styles.nav }${ index ? !passedImage ? ` ${ styles.nav__transparent }` : '' : '' }` }>
      <header className={ styles.header }>
        <LinkLogo />
        <button className={ `hamburger hamburger--squeeze ${ isMenuOpen ? 'is-active' : '' } ${ styles.button__menu }` } type="button" onClick={ toggleSideMenu }>
          <span className="hamburger-box">
            <span className="hamburger-inner"></span>
          </span>
        </button>
      </header>
    </nav>
  )
}
