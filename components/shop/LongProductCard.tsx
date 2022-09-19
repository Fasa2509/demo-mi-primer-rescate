import { FC } from 'react';
import Image from 'next/image'
import NextLink from 'next/link'

import { format } from '../../utils';
import { IProduct } from '../../interfaces';
import styles from './ProductCard.module.css'

interface Props {
    product: IProduct;
}

export const LongProductCard: FC<Props> = ({ product }) => {
  return (
    <NextLink href={ 'tienda' + product.slug } prefetch={ false }>
      <div className={ styles.product__long }>
        <div className={ styles.product__long__image }>
          <Image src={ product.images[0].url } alt={ product.name } width={ 200 } height={ 200 } layout='responsive' />
        </div>
        <div className={ styles.product__info }>
          <div className={ styles.product__name }>{ product.name }</div>
          <div>
            <div className={ styles.product__price + ` ${ product.discount ? styles.div__discount : '' }` }>{ format( product.price ) }</div>
            { product.discount && <span className={ styles.span__discount }> { format( product.discount! ) }</span> }
          </div>
          <div className={ styles.product__long__description }>{ product.description }</div>
        </div>
      </div>
    </NextLink>
  )
}
