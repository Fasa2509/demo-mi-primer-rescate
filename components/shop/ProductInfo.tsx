import { FC, useContext, useState } from 'react';
import { Box, Button, Card, CardContent, Chip, Divider, Link, Typography } from '@mui/material';
import { IProduct } from '../../interfaces';
import { format } from '../../utils';
import { ItemCounter } from './';
import styles from './ProductInfo.module.css';
import { CartContext } from '../../context';

interface Props {
    product: IProduct;
}

export const ProductInfo: FC<Props> = ({ product }) => {

    const [currentValue, setCurrentValue] = useState<number>( 1 );
    const { addProductToCart, removeProductFromCart } = useContext( CartContext );

    let { _id, name, price, tags, description, discount, slug } = product;

  return (
        <Card className={ styles.container } sx={{ width: '100%', maxWidth: '600px' }}>
            <CardContent>
                <Typography className={ styles.name }>{ name }</Typography>

                <Divider />

                <div style={{ display: 'flex', gap: '.4rem', alignItems: 'center' }}>
                    <span className={ styles.price } style={{ textDecoration: discount ? 'line-through' : 'initial' }}>{ format(price) }</span>{ discount && <span className={ styles.discount } style={{ textDecoration: 'none' }}>{ format(discount) }</span> }
                </div>

                <Typography className={ styles.description }>{ description }</Typography>

                <Box display='flex' gap='1rem' alignItems='center'>
                    <Typography>Tienes</Typography><ItemCounter quantity={ currentValue } updateQuantity={ setCurrentValue } />
                </Box>

                { tags.length > 0 &&
                    <div className={ styles.tags__container }>
                        {
                            tags.map((tag: string) => <span key={ tag }>#{ tag }</span>)
                        }
                    </div>
                }

                <Button
                    className='circular-btn'
                    color='secondary'
                    fullWidth
                    onClick={ () => ( currentValue > 0 )
                        ? addProductToCart({
                        _id,
                        name,
                        price,
                        tags,
                        image: product.images[0],
                        quantity: currentValue,
                        discount,
                        slug,
                    }) : removeProductFromCart({
                        _id,
                        name,
                        price,
                        tags,
                        image: product.images[0],
                        quantity: 0,
                        discount,
                        slug,
                    })
                    }
                >
                    { currentValue > 0 ? 'Llevar al carrito' : 'Remover del carrito' }
                </Button>
            </CardContent>
        </Card>
    )
}
