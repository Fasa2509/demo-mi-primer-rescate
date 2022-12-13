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
}

export const ContainerProductType: FC<Props> = ({ type, products }) => {

  return (
        <section className={ styles.products__type__container }>
            <p className={ styles.products__type__title }>{ formatText( type ) }</p>
                {
                    products.slice(0, 6).map((product) => <LongProductCard key={ product.name } product={ product } />)
                }
                <NextLink href={ `/tienda/categoria?tipo=${ type }` } passHref>
                    <Link className={ styles.products__link } color='secondary' alignSelf='flex-end'>Ver más</Link>
                </NextLink>
        </section>
    )
}
