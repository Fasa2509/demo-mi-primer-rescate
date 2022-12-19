import { FC, useContext, lazy, Suspense } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { Badge, Box, Link, Typography } from '@mui/material';
import ShoppingCart from '@mui/icons-material/ShoppingCart';
import { useSnackbar } from 'notistack';

import { LinkLogo } from './LinkLogo';
import { AuthContext, CartContext, MenuContext } from '../../context';
import { ConfirmNotificationButtons, PromiseConfirmHelper } from '../../utils';
import styles from './Header.module.css';

const AdminLinks = lazy(() => import('../../components/layouts/AdminLinks'));

interface Props {
  shop?: boolean;
}

export const Header: FC<Props> = ({ shop = false }) => {

  const { asPath } = useRouter();
  const { isMenuOpen, toggleSideMenu } = useContext( MenuContext );
  const { user, logoutUser } = useContext( AuthContext );
  const { numberOfItems } = useContext( CartContext );
  const { enqueueSnackbar } = useSnackbar();

  const logOut = async ( e: any ) => {
    e.preventDefault();

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

          <Box className={ styles.link__hover }>
            <NextLink href='/miprimerrescate' passHref>
              <Link color='info' className={ `${ styles.link } ${ asPath.startsWith('/miprimerrescate') ? styles.active : '' }` }>Nosotros</Link>
            </NextLink>

            <Box display='flex' flexDirection='column' gap='.35rem' className={ styles.link__display }>
              <NextLink href='/miprimerrescate' passHref>
                <Link color='info' className={ styles.link }>Link 1</Link>
              </NextLink>
              <NextLink href='/miprimerrescate' passHref>
                <Link color='info' className={ styles.link }>Link 2</Link>
              </NextLink>
              <NextLink href='/miprimerrescate' passHref>
                <Link color='info' className={ styles.link }>Link 3</Link>
              </NextLink>
            </Box>
          </Box>

          <Box className={ styles.link__hover }>
            <Typography color='info' className={ `${ styles.link } ${ asPath.startsWith('/apoyo') ? styles.active : '' }` }>Apoyo</Typography>
            
            <Box display='flex' flexDirection='column' gap='.35rem' className={ styles.link__display }>
              <NextLink href='/apoyo' passHref>
                <Link color='info' className={ styles.link }>Link 1</Link>
              </NextLink>
              <NextLink href='/apoyo' passHref>
                <Link color='info' className={ styles.link }>Link 2</Link>
              </NextLink>
              <NextLink href='/apoyo' passHref>
                <Link color='info' className={ styles.link }>Link 3</Link>
              </NextLink>
            </Box>
          </Box>

          <Box display='flex' flexDirection='column' className={ styles.link__hover }>
            <Typography color='info' className={ `${ styles.link } ${ asPath.startsWith('/adoptar') ? styles.active : '' }` }>Adoptar</Typography>
            
            <Box display='flex' flexDirection='column' gap='.35rem' className={ styles.link__display }>
              <NextLink href='/adoptar/perros' passHref>
                <Link color='info' className={ styles.link }>Perros</Link>
              </NextLink>
              <NextLink href='/adoptar/gatos' passHref>
                <Link color='info' className={ styles.link }>Gatos</Link>
              </NextLink>
              <NextLink href='/adoptar/otros' passHref>
                <Link color='info' className={ styles.link }>Otros</Link>
              </NextLink>
              <NextLink href='/adoptar/formulario' passHref>
                <Link color='info' className={ styles.link }>Formulario</Link>
              </NextLink>
            </Box>
          </Box>

          <Box className={ styles.link__hover }>
            <Typography color='info' className={ `${ styles.link } ${ asPath.startsWith('/cambios') ? styles.active : '' }` }>Cambios</Typography>
            
            <Box display='flex' flexDirection='column' gap='.35rem' className={ styles.link__display }>
              <NextLink href='/cambios' passHref>
                <Link color='info' className={ styles.link }>Link 1</Link>
              </NextLink>
              <NextLink href='/cambios' passHref>
                <Link color='info' className={ styles.link }>Link 2</Link>
              </NextLink>
              <NextLink href='/cambios' passHref>
                <Link color='info' className={ styles.link }>Link 3</Link>
              </NextLink>
            </Box>
          </Box>

          <Box className={ styles.link__hover }>
            <NextLink href='/tienda' passHref>
              <Link color='info' className={ `${ styles.link } ${ asPath.startsWith('/tienda') ? styles.active : '' }` }>Tienda</Link>
            </NextLink>

            <Box display='flex' flexDirection='column' gap='.35rem' className={ styles.link__display }>
              <NextLink href='/tienda/categoria?tipo=consumibles' passHref>
                <Link color='info' className={ styles.link }>Consumibles</Link>
              </NextLink>
              <NextLink href='/tienda/categoria?tipo=útil' passHref>
                <Link color='info' className={ styles.link }>Útil</Link>
              </NextLink>
              <NextLink href='/tienda/categoria?tipo=ropa' passHref>
                <Link color='info' className={ styles.link }>Ropa</Link>
              </NextLink>
              <NextLink href='/tienda/categoria?tipo=accesorios' passHref>
                <Link color='info' className={ styles.link }>Accesorios</Link>
              </NextLink>
            </Box>
          </Box>

          {
            ( user )
              ? (
                <Box className={ styles.link__hover }>
                  <Typography color='info' className={ `fadeIn ${ styles.link } ${ asPath.startsWith('/personal') ? styles.active : '' }` }>Personal</Typography>

                  <Box display='flex' flexDirection='column' gap='.35rem' className={ styles.link__display }>
                    <NextLink href='/personal' passHref>
                      <Link color='info' className={ styles.link }>Mi info</Link>
                    </NextLink>

                    <Link color='info' className={ styles.link } onClick={ logOut }>Salir</Link>
                  </Box>
                </Box>
              )
              : (
                <NextLink href={ `/auth?p=${ asPath }` } passHref>
                  <Link color='info' className={ `fadeIn ${ styles.link } ${ asPath.startsWith('/auth') ? styles.active : '' }` }>Entrar</Link>
                </NextLink>
              )
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

      { user && ( user.role === 'superuser' || user.role === 'admin' ) &&
        <Suspense fallback={ <></> }>
          <AdminLinks />
        </Suspense>
      }
      
    </nav>
  )
};
