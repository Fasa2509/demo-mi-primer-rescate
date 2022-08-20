import { FC } from 'react'

import { Star } from '@mui/icons-material'
import { BigProductCard } from './';
import { IProduct } from '../../interfaces'
import styles from './ContainerProduct.module.css'

interface Props {
    initialFavProducts: IProduct[];
}

export const ContainerFavProduct: FC<Props> = ({ initialFavProducts }) => {
    return (
        <section className={ styles.most__sold__container }>
            <p className={ styles.title }>
                Lo más vendido la última semana!
                <Star />
            </p>
            <div className={ styles.most__sold__products }>
                {
                    initialFavProducts.map( (product, index) => <BigProductCard key={ product.name + index } product={ product } />)
                }
            </div>
        </section>
    )
}
