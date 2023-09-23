import { FC, useContext, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { Box, Button, Card, CardContent, Divider, Link, Typography } from '@mui/material';
import Facebook from '@mui/icons-material/Facebook';
import Instagram from '@mui/icons-material/Instagram';
import Twitter from '@mui/icons-material/Twitter';
import WhatsApp from '@mui/icons-material/WhatsApp';

import { SliderImages } from '../layouts';
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
    const { updateProductQuantity, getProductQuantity } = useContext(CartContext);
    const { enqueueSnackbar } = useSnackbar();

    const [didMount, setDidMount] = useState(false);
    const [product, setProduct] = useState<IProduct>(products[0]);
    const [active, setActive] = useState<boolean>(false);
    const [currentSize, setCurrentSize] = useState<Sizes>('unique');
    const [currentValue, setCurrentValue] = useState<number>(getProductQuantity(product._id, currentSize));

    let { _id, name, price, tags, description, discount, inStock, slug } = useMemo(() => product, [product]);

    let sizes = useMemo(() => Object.entries(inStock).filter(s => Number(s[1]) >= 1).map(s => s[0]), [inStock]);

    const productToCart = () => {
        updateProductQuantity({
            _id,
            name,
            price,
            tags,
            image: product.images[0],
            quantity: currentValue,
            size: currentSize,
            maxQuantity: inStock.unique !== -1
                ? inStock.unique
                : (inStock[currentSize] === -1)
                    ? 9
                    : inStock[currentSize] || 9,
            discount,
            slug,
        })
    }

    useEffect(() => setDidMount(true), []);

    useEffect(() => {
        if (!didMount) return;
        let productBySlug = products.find((p) => p.slug === router.query.product);

        if (productBySlug) {
            if (productBySlug._id === product._id) {
                setActive(true);
                return;
            }

            setCurrentSize('unique');
            setProduct(productBySlug);
            setActive(true);
        } else {
            router.push(router.pathname.match(/\/categoria/) ? '/tienda/categoria?tipo=' + router.query.tipo || 'accesorios' : '/tienda', undefined, { shallow: true, scroll: false });
            setActive(false);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query.product]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => setCurrentValue(getProductQuantity(product._id, currentSize)), [product, currentSize]);

    const share = async () => {
        try {
            await navigator.share({
                title: '¡Mira este producto en la tienda MPR!',
                text: 'Visita la página de Mi Primer Rescate y mira sus productos',
                url: `${process.env.NEXT_PUBLIC_DOMAIN_NAME}${router.asPath}`,
            });
        } catch (error) {
            console.log(error)
            enqueueSnackbar('No se pudo compartir', { variant: 'warning' });
        }
    }

    const handleClose = (e: any) => {
        if (e.target.matches('#product-window') || e.target.matches('#product-close'))
            router.push(router.pathname.match(/\/categoria/) ? '/tienda/categoria?tipo=' + router.query.tipo || 'accesorios' : '/tienda', undefined, { shallow: true, scroll: false });
    }

    return didMount
        ? createPortal(
            <section id='product-window' className={`${styles.modal__window}${active ? ` ${styles.modal__active}` : ''}`} onClick={handleClose}>
                <section className={styles.modal__container}>
                    <div className={styles.modal__header}>

                        <p className={styles.product__name}>{name}</p>
                        <button id='product-close' className={styles.modal__close} onClick={handleClose}></button>

                    </div>

                    <Divider sx={{ width: '95%', margin: '.4rem auto 1rem' }} />

                    <section className={styles.product__container}>
                        <div className={styles.slider__container}>
                            <SliderImages images={product.images} options={{ indicators: false, animation: 'slide', fullHeightHover: true, interval: 9000, duration: 650 }} layout='intrinsic' objectFit='cover' borderRadius={false} />
                        </div>

                        <Card sx={{ width: '100%', maxWidth: '500px', alignSelf: 'flex-start', mb: 2.5, backgroundColor: '#fafafa', boxShadow: '0 0 1.2rem -.6rem #66666699' }}>
                            <CardContent>

                                <Box display='flex' gap='.5rem'>
                                    <p className={styles.product__price} style={product.discount > 0 && product.discount <= 0.5 ? { fontSize: '1.1rem', color: '#666', textDecoration: 'line-through' } : {}}>{format(product.price)}</p>
                                    {product.discount > 0 && product.discount <= 0.5 && <p className={styles.product__discount}>{format(product.price - product.discount * product.price)}</p>}
                                </Box>

                                <p className={styles.product__description}>{description}</p>

                                {sizes.length > 0 &&
                                    <Box display='flex' gap='1rem' alignItems='center'>
                                        <Typography>Tienes</Typography><ItemCounter quantity={currentValue} updateQuantity={setCurrentValue} maxValue={inStock.unique !== -1 ? inStock.unique : product.inStock[currentSize] || 9} />
                                    </Box>
                                }

                                {
                                    inStock.unique === -1 && sizes.length > 0 &&
                                    <SizeSelector inStock={inStock} selectedSize={currentSize} setSelectedSize={setCurrentSize} />
                                }

                                {
                                    sizes.length === 0 &&
                                    <Typography sx={{ mt: 1.5 }}>¡Vaya! Parece que no tenemos este producto disponible.</Typography>
                                }

                                {tags.length > 0 &&
                                    <div className={styles.tags__container}>
                                        {
                                            tags.map((tag: string) => <span key={tag}>#{tag}</span>)
                                        }
                                    </div>
                                }

                                <Button
                                    color='secondary'
                                    fullWidth
                                    disabled={inStock.unique === -1 && currentSize === 'unique'}
                                    onClick={productToCart}
                                >
                                    {currentValue > 0 ? 'Llevar al carrito' : 'Remover del carrito'}
                                </Button>

                                <p className={styles.share__title}>Comparte este producto</p>
                                <div className={styles.share__container}>
                                    <Link href={`https://www.facebook.com/sharer.php?u=${process.env.NEXT_PUBLIC_DOMAIN_NAME}/tienda?product=${router.query.product}&t=¡Mira este producto en la tienda MPR!`} target='_blank' rel='noreferrer' className={`${styles.share__button} ${styles.facebook}`}><Facebook color='info' sx={{ fontSize: '1.5rem' }} /></Link>
                                    <button className={`${styles.share__button} ${styles.instagram}`} onClick={share}><Instagram color='info' sx={{ fontSize: '1.5rem' }} /></button>
                                    <Link href={`https://twitter.com/intent/tweet?text=¡Mira este producto en la tienda MPR!&url=${process.env.NEXT_PUBLIC_DOMAIN_NAME}/tienda?product=${router.query.product}`} target='_blank' rel='noreferrer' className={`${styles.share__button} ${styles.twitter}`}><Twitter color='info' sx={{ fontSize: '1.5rem' }} /></Link>
                                    <Link href={`https://api.whatsapp.com/send?text=¡Mira este producto en la tienda MPR! ${process.env.NEXT_PUBLIC_DOMAIN_NAME}/tienda?product=${router.query.product}`} target='_blank' rel='noreferrer' className={`${styles.share__button} ${styles.whatsapp}`}><WhatsApp color='info' sx={{ fontSize: '1.5rem' }} /></Link>
                                </div>

                            </CardContent>
                        </Card>
                    </section>
                </section>
            </section>, document.getElementById('portal')!
        ) : <></>
}