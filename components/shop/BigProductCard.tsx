import { FC } from 'react';
import Image from 'next/image'
import NextLink from 'next/link'

import { format } from '../../utils';
import { IProduct } from '../../interfaces';
import styles from './ProductCard.module.css'
import { Box } from '@mui/material';

interface Props {
    product: IProduct;
}

export const BigProductCard: FC<Props> = ({ product }) => {
  return (
    <NextLink href={ 'tienda' + product.slug } prefetch={ false }>
      <div className={ styles.product }>
        <div className={ styles.product__image }>
          <Image src={ product.images[0].url } alt={ product.name } width={ 400 } height={ 400 } layout='responsive' />
        </div>
        <div className={ styles.product__name }>{ product.name }</div>
        <Box display='flex' gap='.5rem'>
            <p className={ styles.product__price } style={ product.discount > 0 && product.discount < 0.5 ? { fontSize: '1.1rem', color: '#666', textDecoration: 'line-through' } : {}}>{ format( product.price ) }</p>
            { product.discount > 0 && product.discount < 0.5 && <p className={ styles.product__discount }>{ format( product.price - product.discount * product.price ) }</p> }
        </Box>
        <div className={ styles.product__description }>{ product.description }</div>
      </div>
    </NextLink>
  )
}
