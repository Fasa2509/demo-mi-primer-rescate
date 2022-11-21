import { FC } from 'react';
import NextLink from 'next/link';
import { Link } from '@mui/material';

import { LongProductCard } from '.';
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

export const ContainerProductType: FC<Props> = ({ type, products, className = '', more = false, limit = false }) => {

  return (
        <section className={ styles.products__type__container + ' ' + className }>
            <p className={ styles.products__type__title }>{ formatText( type ) }</p>
                {
                    ( limit )
                        ? products.slice(0, 6).map( (product) => <LongProductCard key={ product.name } product={ product } />)
                        : products.map( (product) => <LongProductCard key={ product.name } product={ product } />)
                }
            { more &&
                <NextLink href={ `/tienda/categoria?tipo=${ type }` } passHref>
                    <Link className={ styles.products__link } color='secondary' alignSelf='flex-end'>Cargar más...</Link>
                </NextLink>
            }
        </section>
    )
}
