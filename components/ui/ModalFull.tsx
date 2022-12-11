import { FC, useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/router';
import { Box, Button, Card, CardContent, Divider, Typography } from '@mui/material';

import { SliderImages } from '../slider';
import { ItemCounter, SizeSelector } from '../shop';
import { CartContext } from '../../context';
import { format } from '../../utils';
import { IProduct, Sizes } from '../../interfaces';
import styles from './ModalFull.module.css';

interface Props {
    products: IProduct[];
}

export const ModalFull: FC<Props> = ({ products }) => {

    const router = useRouter();

    const [product, setProduct] = useState( products[0] );
    const [active, setActive] = useState( false );
    const [didMount, setDidMount] = useState( false );

    const { updateProductQuantity, getProductQuantity } = useContext( CartContext );
    const [currentSize, setCurrentSize] = useState<Sizes>('unique');
    const [currentValue, setCurrentValue] = useState<number>( getProductQuantity( product._id, currentSize ) );

    let { _id, name, price, tags, description, discount, inStock, slug } = product;

    let { unique } = inStock;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    // useEffect(() => setCurrentValue(getProductQuantity( product._id, currentSize )), [currentSize]);

    let sizes = Object.entries( inStock ).filter(s => Number(s[1]) >= 1).map(s => s[0]);

    const productToCart = () => {
        updateProductQuantity({
            _id,
            name,
            price,
            tags,
            image: product.images[0],
            quantity: currentValue,
            size: currentSize,
            maxQuantity: unique !== -1
                            ? unique
                            : ( inStock[currentSize] === -1 )
                                ? 9
                                : inStock[currentSize] || 9,
            discount,
            slug,
        })
    }

    useEffect(() => setDidMount( true ), []);

    useEffect(() => {
        let productBySlug = products.find(( p ) => p.slug === `/${ router.query.product }`);
    
        productBySlug && setProduct( productBySlug );
        productBySlug && setActive( true );
        productBySlug || router.push(router.pathname.match(/\/categoria/) ? '/tienda/categoria?tipo=' + router.query.tipo || 'accesorios' : '/tienda', undefined, { shallow: true, scroll: false });
        productBySlug || setActive( false );
        
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query.product]);

    useEffect(() => {
        setCurrentValue( getProductQuantity( product._id, currentSize ) );
    }, [product, currentSize, getProductQuantity]);

    const handleClose = ( e: any ) => {
        if ( e.target.matches('#product-window') || e.target.matches('#product-close') ) {
            router.push(router.pathname.match(/\/categoria/) ? '/tienda/categoria?tipo=' + router.query.tipo || 'accesorios' : '/tienda', undefined, { shallow: true, scroll: false });
            setActive( false );
        }
    }

    return didMount
        ? createPortal(
        <section id='product-window' className={ `${ styles.modal__window }${ active ? ` ${ styles.modal__active }` : '' }` } onClick={ handleClose }>
            <section className={ styles.modal__container }>
                <div className={ styles.modal__header }>
                    
                    <p className={ styles.product__name }>{ name }</p>
                    <button id='product-close' className={ styles.modal__close } onClick={ handleClose }></button>
                    
                </div>
                
                <Divider sx={{ width: '95%', margin: '.4rem auto 1rem' }} />
                
                <section className={ styles.product__container }>
                    <div className={ styles.slider__container }>
                        <SliderImages images={ product.images } options={{ indicators: false, animation: 'slide', fullHeightHover: true, interval: 8000, duration: 650 }} layout={ 'responsive' } />
                    </div>
                        <Card sx={{ width: '100%', maxWidth: '500px', alignSelf: 'flex-start' }}>
                            <CardContent>

                                <Box display='flex' gap='.5rem'>
                                    <p className={ styles.product__price } style={ product.discount > 0 && product.discount <= 0.5 ? { fontSize: '1.1rem', color: '#666', textDecoration: 'line-through' } : {}}>{ format( product.price ) }</p>
                                    { product.discount > 0 && product.discount <= 0.5 && <p className={ styles.product__discount }>{ format( product.price - product.discount * product.price ) }</p> }
                                </Box>

                                <Typography>{ description }</Typography>

                                { sizes.length > 0 &&
                                    <Box display='flex' gap='1rem' alignItems='center'>
                                        <Typography>Tienes</Typography><ItemCounter quantity={ currentValue } updateQuantity={ setCurrentValue } maxValue={ unique !== -1 ? unique : product.inStock[currentSize] || 9 } />
                                    </Box>
                                }

                                {
                                    unique === -1 && sizes.length > 0 &&
                                    <SizeSelector inStock={ inStock } selectedSize={ currentSize } setSelectedSize={ setCurrentSize } />
                                }

                                {
                                    sizes.length === 0 &&
                                    <Typography>¡Vaya! Parece que no tenemos este producto.</Typography>
                                }

                                { tags.length > 0 &&
                                    <div className={ styles.tags__container }>
                                        {
                                            tags.map((tag: string) => <span key={ tag }>#{ tag }</span>)
                                        }
                                    </div>
                                }

                                <Button
                                    color='secondary'
                                    fullWidth
                                    disabled={ unique === -1 && currentSize === 'unique' }
                                    onClick={ productToCart }
                                >
                                    { currentValue > 0 ? 'Llevar al carrito' : 'Remover del carrito' }
                                </Button>

                            </CardContent>
                        </Card>
                </section>
            </section>
        </section>, document.getElementById('portal')!
    ) : <></>
}