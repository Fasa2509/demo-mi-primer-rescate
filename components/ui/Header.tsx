import { FC, useContext } from 'react';
import NextLink from 'next/link';
import { Badge, Link } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';

import { LinkLogo } from './LinkLogo';
import { CartContext, MenuContext, ScrollContext } from '../../context';
import styles from './Header.module.css';

interface Props {
  index?: boolean;
  shop?: boolean;
}

export const Header: FC<Props> = ({ index = false, shop = false }) => {

  const { isMenuOpen, toggleSideMenu } = useContext( MenuContext );
  const { passedElements } = useContext( ScrollContext );
  const { numberOfItems } = useContext( CartContext );

  return (
    <nav className={ `${ styles.nav }${ index ? ( !passedElements.includes('#hero-welcome') ? ` ${ styles.nav__transparent }` : '' ) : '' }` }>
      <header className={ styles.header }>
        { shop &&
          // <NextLink href={ '/tienda/carrito' } passHref>
          //   <a className={ styles.shopping__cart + ' fadeIn' }>
          //       <Badge badgeContent={ numberOfItems > 9 ? '+9' : numberOfItems } color='secondary'>
          //         <ShoppingCart sx={{ fontSize: '1.8rem' }} />
          //       </Badge>
          //   </a>
          // </NextLink>
          <NextLink href='/tienda/carrito' passHref>
              <Link className={ styles.shopping__cart + ' fadeIn' }>
                <Badge sx={{ transform: numberOfItems ? 'translateY(4px)' : 'none', transition: 'transform 100ms ease' }} badgeContent={ numberOfItems > 9 ? '+9' : numberOfItems } color='info'>
                  <ShoppingCart color='info' sx={{ fontSize: '1.7rem' }} />
                </Badge>
              </Link>
          </NextLink>
        }
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
