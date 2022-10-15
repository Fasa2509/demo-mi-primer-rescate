import { FC } from "react"
import NextLink from "next/link"

import { LongProductCard } from "./";
import { IProduct } from "../../interfaces"
import styles from "./ContainerProduct.module.css"
import { formatText } from "../../utils";

interface Props {
    type: string;
    products: IProduct[];
    className?: string;
    more?: boolean;
}

export const ContainerProductType: FC<Props> = ({ type, products, className = '', more = false }) => {

  return (
        <section className={ styles.products__type__container + ' ' + className }>
            <p className={ styles.subtitle }>{ formatText( type ) }</p>
                {
                    products.map( (product) => <LongProductCard key={ product.name } product={ product } />)
                }
            {   more &&
                <NextLink href={ `/tienda/categoria?tipo=${ type }` } passHref>
                    <a className={ styles.products__link }>Explorar más...</a>
                </NextLink>
            }
        </section>
    )
}
