import { FC } from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import { Link, Typography } from '@mui/material';
import styles from './LinkLogo.module.css';

interface Props {
  shop?: boolean;
}

export const LinkLogo: FC<Props> = ({ shop = false }) => {
  return (
    <NextLink href={ '/' } passHref>
      <Link className={ styles.link } sx={{ marginLeft: { xs: '0', md: shop ? '4.5rem' : 0 } }}>
        <Image priority src={ '/favicon.ico' } alt={ 'doggie' } width={ 48 } height={ 48 } />
        <Typography sx={{ /*display: { xs: 'flex', md: 'none' },*/ color: '#fafafa', fontSize: '1.2rem', fontWeight: '600' }}>Mi Primer Rescate</Typography>
      </Link>
    </NextLink>
  )
}
