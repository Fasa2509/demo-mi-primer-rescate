import { FC } from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import { Link } from '@mui/material';
import styles from './Header.module.css';

interface Props {
  shop?: boolean;
}

export const LinkLogo: FC<Props> = ({ shop = false }) => {
  return (
    <NextLink href='/' passHref>
      <Link className={ styles.link__logo } sx={{ marginLeft: { xs: '0', md: shop ? '4.5rem' : 0 } }}>
        <Image priority src='/icon.png' alt='Doggie' width={ 48 } height={ 48 } />
        <h1 className={ styles.link__logo__title }>Mi Primer Rescate</h1>
      </Link>
    </NextLink>
  )
}
