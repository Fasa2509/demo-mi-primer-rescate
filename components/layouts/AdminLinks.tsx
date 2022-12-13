import { useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { Box, Link } from '@mui/material';

import styles from '../ui/Header.module.css';

const AdminLinks = () => {

    const router = useRouter();
    const [linksActive, setLinksActive] = useState( false );

    return (
        <Box className='fadeIn' sx={{ transform: !linksActive ? 'translateX(0%)' : 'translateX(90%)', transition: 'transform 500ms ease', filter: 'drop-shadow(0 3px 3px #003021)', display: { xs: 'none', md: 'flex' }, position: 'absolute', right: 0, backgroundColor: '#B74FD1', padding: '.5rem 1.5rem .5rem .5rem', borderStartStartRadius: '10rem', borderEndStartRadius: '10rem' }}>
          <input type='checkbox' className={ styles.checkbox } onClick={ () => setLinksActive( !linksActive ) } />
          <Box className={ styles.wings } />
          <Box className={ styles.admin__links } sx={{ display: { xs: 'none', md: 'flex' }, gap: '.5rem' }}>
            <NextLink href='/admin/usuarios' passHref>
              <Link className={ router.asPath.startsWith('/admin/usuarios') ? styles.active : '' } sx={{ color: '#fafafa', fontWeight: '600' }}>Usuarios</Link>
            </NextLink>
            <NextLink href='/admin/ordenes' passHref>
              <Link className={ router.asPath.startsWith('/admin/ordenes') ? styles.active : '' } sx={{ color: '#fafafa', fontWeight: '600' }}>Órdenes</Link>
            </NextLink>
            <NextLink href='/admin/productos' passHref>
              <Link className={ router.asPath.startsWith('/admin/productos') ? styles.active : '' } sx={{ color: '#fafafa', fontWeight: '600' }}>Productos</Link>
            </NextLink>
            <NextLink href='/admin/adopciones' passHref>
              <Link className={ router.asPath.startsWith('/admin/adopciones') ? styles.active : '' } sx={{ color: '#fafafa', fontWeight: '600' }}>Adopciones</Link>
            </NextLink>
            <NextLink href='/admin/mascotas' passHref>
              <Link className={ router.asPath.startsWith('/admin/mascotas') ? styles.active : '' } sx={{ color: '#fafafa', fontWeight: '600' }}>Mascotas</Link>
            </NextLink>
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }} />
        </Box>
    )
}

export default AdminLinks;