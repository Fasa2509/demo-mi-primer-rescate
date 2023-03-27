import { FC, useContext, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import NextLink from 'next/link';
import { Box, Button, Grid, IconButton, Link, Typography } from '@mui/material';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline'; 
import RemoveCircleOutline from '@mui/icons-material/RemoveCircleOutline'; 

import { format } from '../../utils';
import { ICartProduct } from '../../interfaces';
import { CartContext } from '../../context';

interface Props {
    product: ICartProduct;
}

export const CartProductInfo: FC<Props> = ({ product }) => {

    const { name, image, price, discount, quantity, size, slug } = useMemo(() => product, [product]);
    const { updateProductQuantity } = useContext( CartContext );

    const [ currentValue, setCurrentValue ] = useState( product.quantity );

    const addOrRemove = ( value: 1 | -1 ) => {
        if ( product.maxQuantity === -1 ) return;
        if ( value === 1 && currentValue === product.maxQuantity ) return;
        if ( value === -1 && currentValue === 0 ) return;
        if ( currentValue > product.maxQuantity ) return setCurrentValue( product.maxQuantity );

        return setCurrentValue(( prevState ) => prevState += value );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => setCurrentValue( product.quantity ), [product]);

    return (
    <Grid container spacing={ 1 } sx={{ display: 'grid', maxWidth: '100%', gridTemplateColumns: '160px 1fr', padding: '.5rem', borderRadius: '1rem', boxShadow: '4px 4px 3rem -2rem #888', border: 'thin solid #eaeaea' }}>
        <Box sx={{ display: 'block', borderRadius: '.5rem', overflow: 'hidden', alignSelf: 'flex-start' }}>
            <Image src={ image.url } alt={ name } width={ image.width } height={ image.height } layout='responsive' />
        </Box>
        <Grid item>
            <NextLink href={ '/tienda?product=' + slug.replace('/', '') } passHref prefetch={ false }>
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
                <Box display='flex' alignItems='center' sx={{ height: '2.4rem' }}>
                    <IconButton onClick={ () => addOrRemove(-1) }>
                        <RemoveCircleOutline />
                    </IconButton>
                    <Typography sx={{ width: 40, textAlign: 'center', color: currentValue === product.maxQuantity ? '#9933b3' : '' }}> { currentValue } </Typography>
                    <IconButton onClick={ () => addOrRemove(+1)} >
                        <AddCircleOutline />
                    </IconButton>
                </Box>
                
                <Button color='secondary' onClick={ () => updateProductQuantity({ ...product, quantity: currentValue, }) }>{ currentValue > 0 ? 'Llevar' : 'Remover' }</Button>
            </Box>
        </Grid>
    </Grid>
  )
}
