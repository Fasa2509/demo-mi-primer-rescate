import { useContext, FC } from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import { Link } from '@mui/material';

import { MenuContext } from '../../context';
import styles from './Header.module.css';

interface Props {
  shop?: boolean;
}

export const LinkLogo: FC<Props> = ({ shop = false }) => {

  const { isMenuOpen, toggleSideMenu } = useContext(MenuContext);

  return (
    <NextLink href='/' passHref>
      <Link className={styles.link__logo} sx={{ marginLeft: { xs: '0', md: shop ? '4.5rem' : 0 } }} onClick={() => isMenuOpen && toggleSideMenu()}>
        <Image priority src='/icon.png' alt='Logo MPR' width={48} height={48} />
        <h1 className={styles.link__logo__title}>
          Fundación <br />Mi Primer Rescate
        </h1>
      </Link>
    </NextLink>
  )
}
