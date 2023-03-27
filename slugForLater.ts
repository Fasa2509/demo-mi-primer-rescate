export {}

// import { useContext } from 'react';
// import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
// import { Button } from '@mui/material';
// import { useSnackbar } from 'notistack';

// import { dbProducts } from '../../database';
// import { AuthContext, ScrollContext } from '../../context';
// import { mprRevalidatePage } from '../../mprApi';
// import { ProductInfo, ShopLayout, SliderImages } from '../../components';
// import { IProduct } from '../../interfaces';
// import styles from '../../styles/Tienda.module.css';

// interface Props {
//     product: IProduct;
// }

// const ProductPage: NextPage<Props> = ({ product }) => {

//   const { user } = useContext( AuthContext );
//   const { setIsLoading } = useContext( ScrollContext );
//   const { enqueueSnackbar } = useSnackbar();
    
//   const revalidate = async () => {
//     if ( process.env.NODE_ENV !== 'production' ) return;

//     setIsLoading( true );
//     const resRev = await mprRevalidatePage('/tienda' + product.slug);
//     setIsLoading( false );

//     enqueueSnackbar(resRev.message, { variant: !resRev.error ? 'success' : 'error' });
//   }

//   return (
//     <ShopLayout title={ product.name } pageDescription={ product.name + ' | Tienda' } pageImage={ product.images[0].url }>
//         <section className={ styles.product__container }>
//             <div className={ styles.slider__container }>
//             <SliderImages images={ product.images } options={{ indicators: false, animation: 'slide', fullHeightHover: true, interval: 8000, duration: 650 }} layout={ 'responsive' } />
//             </div>
//             <div className={ styles.product__info }>
//                 <ProductInfo product={ product } />
//             </div>
//         </section>

//         <>
//           { user && ( user.role === 'admin' || user.role === 'superuser' ) &&
//             <Button className='fadeIn' variant='contained' color='secondary' sx={{ mt: 2 }} onClick={ revalidate }>Revalidar esta página</Button>
//           }
//         </>

//     </ShopLayout>
//   )
// }

// // You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes

// export const getStaticPaths: GetStaticPaths = async ( ctx ) => {
    
//     const products = await dbProducts.getAllProducts();

//     if ( !products ) throw new Error('No se encontraron productos');

//     const productSlugs = products.map(( product ) => product.slug.substring(1));

//     return {
//         paths: productSlugs.map(( slug ) => ({
//             params: {
//                 slug,
//             }
//         })),
//         fallback: "blocking",
//     }
// }

// export const getStaticProps: GetStaticProps = async ( ctx ) => {
    
//     const { slug = '' } = ctx.params as { slug: string };

//     if ( !slug ) throw new Error('Falta el slug del producto');

//     const product = await dbProducts.getProductBySlug( '/' + slug );

//     if ( product === false ) {
//         return {
//             notFound: true,
//             revalidate: 3600 * 24,
//         }
//     }

//     if ( !product ) {
//         return {
//             redirect: {
//                 destination: '/tienda',
//                 permanent: false,
//             }
//         }
//     }

//     return {
//         props: {
//             product,
//         },
//         revalidate: 3600 * 12 // 24h
//     }
// }

// export default ProductPage