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

export const LongProductCard: FC<Props> = ({ product }) => {
  return (
    <div className={ styles.product__long }>
      <div className={ styles.product__long__image }>
        <Image src={ product.image } alt={ product.name } width={ 200 } height={ 200 } layout='responsive' />
      </div>
      <div className={ styles.product__info }>
        <div className={ styles.product__name }>{ product.name }</div>
        <div className={ styles.product__price }>{ format( product.price ) }</div>
        <div className={ styles.product__long__description }>{ product.description }</div>
      </div>
    </div>
  )
}
