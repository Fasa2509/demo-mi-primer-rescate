import { FC, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { useSession } from 'next-auth/react';
import { Badge, Box, Button, Link } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

import { LinkLogo } from './LinkLogo';
import { AuthContext, CartContext, MenuContext } from '../../context';
import { ConfirmNotificationButtons, PromiseConfirmHelper } from '../../utils';
import styles from './Header.module.css';

interface Props {
  index?: boolean;
  shop?: boolean;
}

export const Header: FC<Props> = ({ index = false, shop = false }) => {

  const router = useRouter();
  const { data } = useSession();
  let session: any = data;
  const { isMenuOpen, toggleSideMenu } = useContext( MenuContext );
  const { logoutUser } = useContext( AuthContext );
  const { numberOfItems } = useContext( CartContext );
  const { enqueueSnackbar } = useSnackbar();
  const [linksActive, setLinksActive] = useState( false );

  const logOut = async () => {
    let key = enqueueSnackbar('¿Quieres cerrar sesión?', {
      variant: 'info',
      autoHideDuration: 10000,
      action: ConfirmNotificationButtons,
    })

    const confirm = await PromiseConfirmHelper( key, 10000 );

    if ( !confirm ) return;

    logoutUser();
    return;
  }

  return (
    <nav className={ styles.nav }>
      <header className={ styles.header }>

        { shop &&
          <NextLink href='/tienda/carrito' passHref>
              <Link className={ styles.shopping__cart + ' fadeIn' }>
                <Badge sx={{ transform: numberOfItems ? 'translateY(4px)' : 'none', transition: 'transform 100ms ease' }} badgeContent={ numberOfItems > 9 ? '+9' : numberOfItems } color='info'>
                  <ShoppingCart color='info' sx={{ fontSize: '1.7rem' }} />
                </Badge>
              </Link>
          </NextLink>
        }
        
        <LinkLogo shop={ shop } />

        <Box className={ styles.links } sx={{ display: { xs: 'none', md: 'flex', gap: '.6rem' } }}>
          <NextLink href='/' passHref>
            <Link color='info'>Inicio</Link>
          </NextLink>
          <NextLink href='/miprimerrescate' passHref>
            <Link color='info' className={ `${ router.asPath === '/miprimerrescate' ? styles.active : '' }` }>Proyecto MPR</Link>
          </NextLink>
          <NextLink href='/apoyo' passHref>
            <Link color='info' className={ `${ router.asPath === '/apoyo' ? styles.active : '' }` }>Apoyo</Link>
          </NextLink>
          <NextLink href='/adoptar' passHref>
            <Link color='info' className={ `${ router.asPath === '/adoptar' ? styles.active : '' }` }>Adoptar</Link>
          </NextLink>
          <NextLink href='/cambios' passHref>
            <Link color='info' className={ `${ router.asPath === '/cambios' ? styles.active : '' }` }>Cambios</Link>
          </NextLink>
          <NextLink href='/tienda' passHref>
            <Link color='info' className={ `${ router.asPath === '/tienda' ? styles.active : '' }` }>Tienda</Link>
          </NextLink>
          {
            session &&
            <NextLink href='/personal' passHref>
              <Link color='info' className={ `fadeIn ${ router.asPath === '/personal' ? styles.active : '' }` }>Personal</Link>
            </NextLink>
          }
          {
            ( session )
              ? <button className={ `button ${ styles.buttons }` } onClick={ logOut }>
                  <Link color='info' className='fadeIn'>Salir</Link>
                </button>
              : <button className={ `button ${ styles.buttons }` }>
                  <Link color='info' className='fadeIn' onClick={ () => router.push(`/auth?p=${ router.asPath }`) }>Entrar</Link>
                </button>
          }
        </Box>

        <Box sx={{ position: 'absolute', right: '5vw', display: { md: 'none' } }}>
          <button className={ `hamburger hamburger--squeeze ${ isMenuOpen ? 'is-active' : '' }` } type="button" onClick={ toggleSideMenu }>
            <span className="hamburger-box">
              <span className="hamburger-inner"></span>
            </span>
          </button>
        </Box>
      </header>

      { session && session.user && ( session.user.role === 'superuser' || session.user.role === 'admin' ) &&
        <Box sx={{ transform: !linksActive ? 'translateX(0%)' : 'translateX(84%)', transition: 'transform 500ms ease', filter: 'drop-shadow(0 3px 3px #003021)', display: { xs: 'none', md: 'flex' }, position: 'absolute', right: 0, backgroundColor: '#B74FD1', padding: '.5rem 1.5rem .5rem .5rem', borderStartStartRadius: '10rem', borderEndStartRadius: '10rem' }}>
          <input type='checkbox' className={ styles.checkbox } onClick={ () => setLinksActive( !linksActive ) } />
          <Box className={ styles.wings } />
          <Box className={ styles.admin__links } sx={{ display: { xs: 'none', md: 'flex' }, gap: '.5rem' }}>
            <NextLink href='/admin/usuarios' passHref>
              <Link sx={{ color: '#fafafa', fontWeight: '600' }}>Usuarios</Link>
            </NextLink>
            <NextLink href='/admin/ordenes' passHref>
              <Link sx={{ color: '#fafafa', fontWeight: '600' }}>Órdenes</Link>
            </NextLink>
            <NextLink href='/admin/productos' passHref>
              <Link sx={{ color: '#fafafa', fontWeight: '600' }}>Productos</Link>
            </NextLink>
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }} />
        </Box>
      }
      
    </nav>
  )
}

// export const Header: FC<Props> = ({ index = false, shop = false }) => {

//   const { isMenuOpen, toggleSideMenu } = useContext( MenuContext );
//   const { passedElements } = useContext( ScrollContext );
//   const { numberOfItems } = useContext( CartContext );

//   return (
//     <nav className={ `${ styles.nav }${ index ? ( !passedElements.includes('#hero-welcome') ? ` ${ styles.nav__transparent }` : '' ) : '' }` }>
//       <header className={ styles.header }>
//         { shop &&
//           <NextLink href='/tienda/carrito' passHref>
//               <Link className={ styles.shopping__cart + ' fadeIn' }>
//                 <Badge sx={{ transform: numberOfItems ? 'translateY(4px)' : 'none', transition: 'transform 100ms ease' }} badgeContent={ numberOfItems > 9 ? '+9' : numberOfItems } color='info'>
//                   <ShoppingCart color='info' sx={{ fontSize: '1.7rem' }} />
//                 </Badge>
//               </Link>
//           </NextLink>
//         }
//         <LinkLogo />
//         <button className={ `hamburger hamburger--squeeze ${ isMenuOpen ? 'is-active' : '' } ${ styles.button__menu }` } type="button" onClick={ toggleSideMenu }>
//           <span className="hamburger-box">
//             <span className="hamburger-inner"></span>
//           </span>
//         </button>
//       </header>
//     </nav>
//   )
// }
