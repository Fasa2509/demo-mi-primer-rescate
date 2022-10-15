import { FC, useState, useEffect } from 'react';
import Image from 'next/image'
import NextLink from 'next/link'
import { Box, Typography, Chip } from '@mui/material';

import { format } from '../../utils';
import { IProduct } from '../../interfaces';
import styles from './ProductCard.module.css'

interface Props {
    product: IProduct;
}

export const LongProductCard: FC<Props> = ({ product }) => {

  const [q, setQ] = useState( 0 );

  useEffect(() => {
    let value = 0;

    Object.values( product.inStock ).forEach(v => {
      if ( v > 0 ) value += v;
    })

    setQ( value );
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <NextLink href={ '/tienda' + product.slug } prefetch={ false }>
      <div className={ styles.product__long }>
        <div className={ styles.product__long__image }>
          <Image src={ product.images[0].url } alt={ product.name } width={ 1 } height={ 1 } layout='responsive' />
          { q <= 10 &&
            <Chip
              color='warning'
              label='Quedan pocos'
              variant='outlined'
              sx={{ position: 'absolute', zIndex: 99, bottom: '.5rem', right: '.5rem' }}
            />
          }
        </div>
        <div className={ styles.product__info }>
          <Typography sx={{ fontWeight: '600', fontSize: '1.15rem' }}>{ product.name }</Typography>
          <Box display='flex' gap='.5rem'>
            <p className={ styles.product__price } style={ product.discount > 0 && product.discount < 0.5 ? { fontSize: '1.1rem', color: '#666', textDecoration: 'line-through' } : {}}>{ format( product.price ) }</p>
            { product.discount > 0 && product.discount < 0.5 && <p className={ styles.product__discount }>{ format( product.price - product.discount * product.price ) }</p> }
          </Box>
          <div className={ styles.product__long__description }>{ product.description }</div>
        </div>
      </div>
    </NextLink>
  )
}
