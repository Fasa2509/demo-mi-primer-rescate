import Image from 'next/image'
import { FC } from 'react';
import { format } from '../../utils';
import styles from './ProductCard.module.css'

interface Props {
    product: {
        image: string;
        name: string;
        price: number;
        description?: string;
    }
}

export const BigProductCard: FC<Props> = ({ product }) => {
  return (
    <div className={ styles.product }>
      <div className={ styles.product__image }>
        <Image src={ product.image } alt={ product.name } width={ 400 } height={ 400 } />
      </div>
      <div className={ styles.product__name }>{ product.name }</div>
      <div className={ styles.product__price }>{ format( product.price ) }</div>
      <div style={{ marginTop: '.5rem' }} className={ styles.product__description }>{ product.description }</div>
    </div>
  )
}
