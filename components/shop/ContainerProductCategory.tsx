import { FC } from 'react';
import { useRouter } from 'next/router';

import { LongCategoryProductCard } from '.';
import { formatText } from '../../utils';
import { IProduct } from '../../interfaces';
import styles from './ContainerProduct.module.css';

interface Props {
    type: string;
    products: IProduct[];
}

export const ContainerProductCategory: FC<Props> = ({ type, products }) => {
    
    const router = useRouter();

    const shallowNavigate = ( query: string ) =>
        router.push(router.asPath + query, undefined, { shallow: true });

    return (
        <section className={ styles.products__type__container }>
            <p className={ styles.products__type__title }>{ formatText( type ) }</p>
                {
                    ( products.length > 1 )
                        ? products.map((product) => <LongCategoryProductCard key={ product.name } product={ product } navigateTo={ shallowNavigate } />)
                        : type === '-' ? <p>¡Filtra productos por categoría y encuentra el que más te guste!</p> : <p>Vaya, parece que no tenemos productos de esa categoría.</p>
                }
        </section>
    )
}
