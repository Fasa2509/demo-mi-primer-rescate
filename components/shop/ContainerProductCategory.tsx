import { FC } from 'react';

import { LongCategoryProductCard } from '.';
import { formatText } from '../../utils';
import { IProduct } from '../../interfaces';
import styles from './ContainerProduct.module.css';

interface Props {
    type: string;
    products: IProduct[];
    className?: string;
    more?: boolean;
    limit?: boolean;
}

export const ContainerProductCategory: FC<Props> = ({ type, products }) => {

  return (
        <section className={ styles.products__type__container }>
            <p className={ styles.products__type__title }>{ formatText( type ) }</p>
                {
                    products.map((product) => <LongCategoryProductCard key={ product.name } product={ product } cat={ type } />)
                }
        </section>
    )
}
