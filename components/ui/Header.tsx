import { FC, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { useSession } from 'next-auth/react';
import { Badge, Box, Button, Link, Typography } from '@mui/material';
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
          {/* <NextLink href='/' passHref>
            <Link className={ styles.link__hover } color='info'>
              Inicio
            </Link>
          </NextLink>
          <Box className={ styles.link__display }>
            
          </Box> */}
          <Box className={ styles.link__hover }>
            <NextLink href='/miprimerrescate' passHref>
              <Link color='info' className={ `${ styles.link } ${ router.asPath.startsWith('/miprimerrescate') ? styles.active : '' }` }>Nosotros</Link>
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
            <Typography color='info' className={ `${ styles.link } ${ router.asPath.startsWith('/apoyo') ? styles.active : '' }` }>Apoyo</Typography>
            
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

          {/* <NextLink href='/apoyo' passHref>
            <Link></Link>
          </NextLink> */}

          <Box display='flex' flexDirection='column' className={ styles.link__hover }>
            <Typography color='info' className={ `${ styles.link } ${ router.asPath.startsWith('/adoptar') ? styles.active : '' }` }>Adoptar</Typography>
            
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

          {/* <NextLink href='/adoptar' passHref>
            <Link></Link>
          </NextLink> */}

          <Box className={ styles.link__hover }>
            <Typography color='info' className={ `${ styles.link } ${ router.asPath.startsWith('/cambios') ? styles.active : '' }` }>Cambios</Typography>
            
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

          {/* <NextLink href='/cambios' passHref>
            <Link></Link>
          </NextLink> */}

          <Box className={ styles.link__hover }>
            <NextLink href='/tienda' passHref>
              <Link color='info' className={ `${ styles.link } ${ router.asPath.startsWith('/tienda') ? styles.active : '' }` }>Tienda</Link>
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

          {/* <NextLink href='/tienda' passHref>
            <Link></Link>
          </NextLink> */}
          {
            ( session )
              ? (
                <Box className={ styles.link__hover }>
                    <Typography color='info' className={ `fadeIn ${ styles.link } ${ router.asPath.startsWith('/personal') ? styles.active : '' }` }>Personal</Typography>

                  <Box display='flex' flexDirection='column' gap='.35rem' className={ styles.link__display }>
                    <NextLink href='/personal' passHref>
                      <Link color='info' className={ styles.link }>Mi info</Link>
                    </NextLink>

                    <Link color='info' className={ styles.link } onClick={ logOut }>Salir</Link>
                  </Box>
                </Box>
              )
              : (
                <NextLink href={ `/auth?p=${ router.asPath }` } passHref>
                  <Link color='info' className={ `fadeIn ${ styles.link } ${ router.asPath === '/auth' ? styles.active : '' }` }>Entrar</Link>
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

      { session && session.user && ( session.user.role === 'superuser' || session.user.role === 'admin' ) &&
        <Box sx={{ transform: !linksActive ? 'translateX(0%)' : 'translateX(88%)', transition: 'transform 500ms ease', filter: 'drop-shadow(0 3px 3px #003021)', display: { xs: 'none', md: 'flex' }, position: 'absolute', right: 0, backgroundColor: '#B74FD1', padding: '.5rem 1.5rem .5rem .5rem', borderStartStartRadius: '10rem', borderEndStartRadius: '10rem' }}>
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
            <NextLink href='/admin/adopciones' passHref>
              <Link sx={{ color: '#fafafa', fontWeight: '600' }}>Adopciones</Link>
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
