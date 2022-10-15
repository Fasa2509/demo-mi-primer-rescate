import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { ProductInfo, ShopLayout, SliderImages } from '../../components';
import { dbProducts } from '../../database';
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
                <SliderImages images={ product.images } options={{ indicators: false, animation: 'slide', fullHeightHover: true, interval: 6500 }} layout={ 'responsive' } />
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
    
    const products = await dbProducts.getAllProducts();

    if ( !products ) throw new Error('No se encontraron productos');

    const productSlugs = products.map(( product ) => product.slug.substring(1));

    return {
        paths: productSlugs.map(( slug ) => ({
            params: {
                slug,
            }
        })),
        fallback: "blocking",
    }
}

export const getStaticProps: GetStaticProps = async ( ctx ) => {
    
    const { slug = '' } = ctx.params as { slug: string };

    if ( !slug ) throw new Error('Falta el slug del producto');

    const product = await dbProducts.getProductBySlug( '/' + slug );

    if ( !product ) {
        return {
            redirect: {
                destination: '/tienda',
                permanent: false,
            }
        }
    }

    return {
        props: {
            product,
        }
    }
}

export default ProductPage