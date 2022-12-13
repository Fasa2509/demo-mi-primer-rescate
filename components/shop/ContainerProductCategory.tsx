import { FC } from 'react';

import { LongCategoryProductCard } from '.';
import { formatText } from '../../utils';
import { IProduct, Tags, TagsArray } from '../../interfaces';
import styles from './ContainerProduct.module.css';

interface Props {
    type: string;
    products: IProduct[];
}

export const ContainerProductCategory: FC<Props> = ({ type, products }) => {

  return (
        <section className={ styles.products__type__container }>
            <p className={ styles.products__type__title }>{ formatText( type ) }</p>
                {
                    ( products.length > 1 )
                        ? products.map((product) => <LongCategoryProductCard key={ product.name } product={ product } cat={ type } />)
                        : type === '-' ? <p>¡Filtra productos por categoría y encuentra el que más te guste!</p> : <p>Vaya, parece que no tenemos productos de esa categoría.</p>
                }
        </section>
    )
}
