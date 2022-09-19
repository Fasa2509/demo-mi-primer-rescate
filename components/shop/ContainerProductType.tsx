import { FC } from "react"
import NextLink from "next/link"

import { LongProductCard } from "./";
import { IProduct } from "../../interfaces"
import styles from "./ContainerProduct.module.css"

interface Props {
    type: string;
    initialProducts: IProduct[];
}

export const ContainerProductType: FC<Props> = ({ type, initialProducts }) => {

  return (
        <section className={ styles.products__type__container }>
            <p className={ styles.subtitle }>{ type }</p>
                {
                    initialProducts.map( (product) => <LongProductCard key={ product.name } product={ product } />)
                }
            <NextLink href={ `tienda?tipo=${ type.toLowerCase() }` } passHref>
                <a className={ styles.products__link }>Explorar más...</a>
            </NextLink>
        </section>
    )
}
