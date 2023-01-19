import { FC } from 'react';
import NextLink from 'next/link';

import { MyImage } from '../cards';
import { format } from '../../utils';
import { IProduct } from '../../interfaces';
import { Box, Typography } from '@mui/material';
import styles from './ProductCard.module.css';

interface Props {
    product: IProduct;
}

export const BigProductCard: FC<Props> = ({ product }) => {
  return (
    <NextLink href={{
      pathname: '/tienda',
      query: { product: product.slug.replace('/', '') },
    }} scroll={ false } prefetch={ false } shallow>
      <Box className={ styles.big__product__info } display='flex' flexDirection='column'>
        <Box className={ styles.big__product__image }>
          <MyImage src={ product.images[0].url } alt={ product.name } width={ 1 } height={ 1 } layout='responsive' objectFit='cover' />
        </Box>
        <Box className={ styles.big__product__data }>
          <Typography sx={{ fontWeight: '600', fontSize: '1.1rem', lineHeight: '1.15' }}>{ product.name }</Typography>
          <Box display='flex' gap='.5rem'>
            <p className={ `${ styles.big__product__price }${ product.discount > 0 && product.discount <= 0.5 ? ` ${ styles.big__product__price__d }` : '' }` }>{ format( product.price ) }</p>
            { product.discount > 0 && product.discount <= 0.5 && <p className={ styles.big__product__discount }>{ format( product.price * (1 - product.discount) ) }</p> }
          </Box>
          <Box flexGrow='1'></Box>
          <Box display='flex' gap='.5rem' alignSelf='flex-end' sx={{ justifySelf: 'flex-end', fontSize: { xs: '1rem', md: '.9rem' }, fontWeight: '600', color: '#666' }}>
          {
            product.tags.map(( tag ) => <span key={ tag }>#{ tag }</span>)
          }
          </Box>
        </Box>
      </Box>
    </NextLink>
  )
}