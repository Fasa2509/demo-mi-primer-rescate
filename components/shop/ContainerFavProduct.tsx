import { FC } from 'react'

import { Star } from '@mui/icons-material'
import { BigProductCard } from './';
import { IProduct } from '../../interfaces'
import styles from './ContainerProduct.module.css'

interface Props {
    products: IProduct[];
}

export const ContainerFavProduct: FC<Props> = ({ products }) => {
    return (
        <section className={ styles.most__sold__container }>
            <p className={ styles.title }>
                ¡Lo más vendido la última semana!
                <Star />
            </p>
            <div className={ styles.most__sold__products }>
                {
                    products.map((product, index) => <BigProductCard key={ product.name + index } product={ product } />)
                }
            </div>
        </section>
    )
}
