import { FC, useContext, useMemo, useState } from 'react';
import Image from 'next/image';
import NextLink from 'next/link';
import { Box, Button, Grid, Link, Typography } from '@mui/material';

import { format } from '../../utils';
import { ICartProduct } from '../../interfaces';
import { ItemCounter } from '..';
import { CartContext } from '../../context';

interface Props {
    product: ICartProduct;
}

export const CartProductInfo: FC<Props> = ({ product }) => {

    const { name, image, price, discount, quantity, size, slug } = useMemo(() => product, [product]);
    const { updateProductQuantity } = useContext( CartContext );
    
    const [ currentValue, setCurrentValue ] = useState( product.quantity );

    return (
    <Grid container spacing={ 1 } sx={{ display: 'grid', maxWidth: '100%', gridTemplateColumns: '160px 1fr', padding: '.5rem', borderRadius: '1rem', boxShadow: '4px 4px 3rem -2rem #888', border: 'thin solid #eaeaea' }}>
        <div style={{ display: 'block', borderRadius: '.5rem', overflow: 'hidden', alignSelf: 'flex-start' }}>
            <Image src={ image.url } alt={ name } width={ image.width } height={ image.height } layout='responsive' />
        </div>
        <Grid item>
            <NextLink href={ '/tienda?product=' + slug.substring(1) } passHref prefetch={ false }>
                <Link underline="hover" color="#000" display='inline-block'>
                    <Typography>{ name }{ size !== 'unique' ? ` (${ size })` : '' }</Typography>
                </Link>
            </NextLink>

            <Box display='flex' alignItems='center' gap='.5rem'>
                <Typography sx={{ fontWeight: '600', fontSize: !discount ? '1rem' : '.9rem', textDecoration: !discount ? 'none' : 'line-through' }}>{ format(price) }</Typography>
                { discount > 0 && <Typography sx={{ fontWeight: '600', color: '#777' }}>{ format( price - discount * price ) }</Typography> }
            </Box>

            <Typography>Tienes: { quantity }</Typography>

            <Box display='flex' gap='.1rem .8rem' alignItems='center' flexWrap='wrap'>
                <ItemCounter quantity={ currentValue } updateQuantity={ setCurrentValue } maxValue={ product.maxQuantity } />
                <Button color='secondary'
                    onClick={ () => updateProductQuantity({
                            ...product,
                            quantity: currentValue,
                        })
                    }
                >{ currentValue > 0 ? 'Llevar' : 'Remover' }</Button>
            </Box>
        </Grid>
    </Grid>
  )
}
