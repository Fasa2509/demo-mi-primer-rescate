import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { ProductInfo, ShopLayout, SliderImages } from '../../components';
import { allProducts, IProduct } from '../../interfaces';
import styles from '../../styles/Tienda.module.css';

interface Props {
    product: IProduct;
}

const ProductPage: NextPage<Props> = ({ product }) => {

  return (
    <ShopLayout title={ product.name } pageDescription={ product.name + ' | Tienda' }>
        <section className={ styles.product__container }>
            <div className={ styles.slider__container }>
                <SliderImages images={ product.images } options={{ indicators: false, animation: 'slide' }} layout={ 'responsive' } />
            </div>
            <div className={ styles.product__info }>
                <ProductInfo product={ product } />
            </div>
        </section>
    </ShopLayout>
  )
}

// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes

export const getStaticPaths: GetStaticPaths = async (ctx) => {
    
    const productSlug = allProducts.map(( product ) => product.slug.substring(1));

    return {
        paths: productSlug.map(( slug ) => ({
            params: {
                slug
            }
        })),
        fallback: "blocking"
    }
}

export const getStaticProps: GetStaticProps = async ( ctx ) => {
    
    const { slug } = ctx.params as { slug: string };

    const product = JSON.parse( JSON.stringify(allProducts.find(( product: IProduct ) => product.slug === `/${ slug }`)) );

    return {
        props: {
            product
        }
    }
}

export default ProductPage