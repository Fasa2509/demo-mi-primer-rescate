import { FC, useContext, useState, useEffect } from 'react';
import { Box, Button, Card, CardContent, Divider, Typography } from '@mui/material';
import NextLink from 'next/link';

import { CartContext } from '../../context';
import { ItemCounter, SizeSelector } from '.';
import { format } from '../../utils';
import { IProduct, Sizes } from '../../interfaces';
import styles from './ProductInfo.module.css';

interface Props {
    product: IProduct;
}

export const ProductInfo: FC<Props> = ({ product }) => {

    const { updateProductQuantity, getProductQuantity } = useContext( CartContext );
    const [currentSize, setCurrentSize] = useState<Sizes>('unique');
    const [currentValue, setCurrentValue] = useState<number>( getProductQuantity( product._id, currentSize ) );

    let { _id, name, price, tags, description, discount, inStock, slug } = product;

    let { unique } = inStock;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => setCurrentValue(getProductQuantity( product._id, currentSize )), [currentSize]);

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

  return (
        <Card className={ styles.container } sx={{ width: '100%', maxWidth: '600px' }}>
            <CardContent>
                <Typography className={ styles.name }>{ name }</Typography>

                <Divider />

                <Box display='flex' gap='.5rem'>
                    <p className={ styles.product__price } style={ product.discount > 0 && product.discount <= 0.5 ? { fontSize: '1.1rem', color: '#666', textDecoration: 'line-through' } : {}}>{ format( product.price ) }</p>
                    { product.discount > 0 && product.discount <= 0.5 && <p className={ styles.product__discount }>{ format( product.price - product.discount * product.price ) }</p> }
                </Box>

                <Typography className={ styles.description }>{ description }</Typography>

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

                <NextLink href={ '/tienda' } scroll={ false }>
                    <Button
                        color='secondary'
                        fullWidth
                        >
                        Volver a la tienda
                    </Button>
                </NextLink>
            </CardContent>
        </Card>
    )
}
