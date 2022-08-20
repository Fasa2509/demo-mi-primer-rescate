import { FC } from 'react';
import Image from 'next/image'
import NextLink from 'next/link'

import { format } from '../../utils';
import { IProduct } from '../../interfaces';
import styles from './ProductCard.module.css'

interface Props {
    product: IProduct;
}

export const BigProductCard: FC<Props> = ({ product }) => {
  return (
    <NextLink href={ product.slug } prefetch={ false }>
      <div className={ styles.product }>
        <div className={ styles.product__image }>
          <Image src={ product.image } alt={ product.name } width={ 400 } height={ 400 } />
        </div>
        <div className={ styles.product__name }>{ product.name }</div>
        <div 
          style={{ textDecoration: product.discount ? 'line-through' : 'none' }}
          className={ styles.product__price }
        >
          { format( product.price ) }
        </div>
        { product.discount && <span style={{ color: '#000' }}> { format( product.discount ) }</span> }
        <div className={ styles.product__description }>{ product.description }</div>
      </div>
    </NextLink>
  )
}
