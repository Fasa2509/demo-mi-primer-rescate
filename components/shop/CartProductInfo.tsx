import { FC, useContext, useState } from "react"
import Image from "next/image";
import NextLink from "next/link";
import { Box, Button, Grid, Link, Typography } from '@mui/material';
import { format } from '../../utils'
import { ICartProduct } from "../../interfaces"
import { ItemCounter } from "..";
import { CartContext } from "../../context";

interface Props {
    product: ICartProduct;
}

export const CartProductInfo: FC<Props> = ({ product }) => {

    const [ currentValue, setCurrentValue ] = useState( product.quantity );
    const { addProductToCart, removeProductFromCart } = useContext( CartContext );
    let { name, image, price, discount, quantity, tags, slug } = product;

    return (
    <Grid container spacing={ 1 } sx={{ display: 'grid', gridTemplateColumns: '160px 1fr', padding: '.5rem', borderRadius: '1rem', boxShadow: '4px 4px 3rem -2rem #888' }}>
        <div style={{ display: 'block', borderRadius: '.5rem', overflow: 'hidden', alignSelf: 'flex-start' }}>
            <Image src={ image.url } alt={ name } width={ image.width } height={ image.height } layout='responsive' />
        </div>
        <Grid item>
            <NextLink href={ 'tienda' + slug } passHref><Link underline="hover" color="#000" display='inline-block'><Typography>{ name }</Typography></Link></NextLink>

            <Box display='flex' alignItems='center' gap='.5rem'>
                <Typography sx={{ fontWeight: '600', fontSize: !discount ? '.9rem' : '.8rem', textDecoration: !discount ? 'none' : 'line-through' }}>{ format(price) }</Typography>
                { discount && <Typography sx={{ fontWeight: '600', color: '#8a8a8a' }}>{ format(discount) }</Typography> }
            </Box>

            <Typography>Tienes: { quantity }</Typography>

            <Box display='flex' gap='.1rem .8rem' alignItems='center' flexWrap='wrap'>
                <ItemCounter quantity={ currentValue } updateQuantity={ setCurrentValue } />
                <Button color='secondary'
                    onClick={ () => ( currentValue > 0 )
                        ? addProductToCart({
                            ...product,
                            quantity: currentValue,
                        })
                        : removeProductFromCart( product )
                    }
                >{ currentValue > 0 ? 'Llevar' : 'Remover' }</Button>
            </Box>

            <Box display='flex' justifyContent='flex-end' gap='.5rem'>
                {
                    tags.map(tag => <Typography key={ tag } sx={{ fontSize: '.8rem', color: '#8a8a8a' }}>#{ tag }</Typography>)
                }
            </Box>
        </Grid>
    </Grid>
  )
}
