import { FC } from 'react';
import Image from 'next/image'
import NextLink from 'next/link'

import { format } from '../../utils';
import { IProduct } from '../../interfaces';
import styles from './ProductCard.module.css'
import { Box, Typography } from '@mui/material';

interface Props {
    product: IProduct;
}

// export const BigProductCard: FC<Props> = ({ product }) => {
//   return (
//     <NextLink href={ 'tienda' + product.slug } prefetch={ false }>
//       <Box display='flex' flexDirection='column' className={ styles.product }>
//         <div style={{ width: '75%', margin: '0 auto', cursor: 'pointer' }} className={ styles.product__image }>
//           <Image src={ product.images[0].url } alt={ product.name } width={ 400 } height={ 400 } layout='responsive' />
//         </div>
//         <Box sx={{ mt: -7, backgroundColor: 'var(--secondary-color-1)', height: '2.5rem', borderStartStartRadius: '1.5rem', borderStartEndRadius: '1.5rem' }}></Box>
//         <Box display='flex' flexDirection='column' sx={{ mt: 0, padding: '0 .5rem .5rem', backgroundColor: 'var(--secondary-color-1)', borderEndEndRadius: '1.5rem', borderEndStartRadius: '1.5rem' }}>
//           <p style={{ margin: 0, marginTop: '.7rem' }} className={ styles.product__name }>{ product.name }</p>
//           <p className={ styles.product__price } style={ product.discount > 0 && product.discount <= 0.5 ? { fontSize: '1.1rem', color: '#666', textDecoration: 'line-through' } : {}}>{ format( product.price ) }</p>
//           { product.discount > 0 && product.discount <= 0.5 && <p className={ styles.product__discount }>{ format( product.price * (1 - product.discount) ) }</p> }
//         </Box>
//       </Box>
//     </NextLink>
//   )
// }


export const BigProductCard: FC<Props> = ({ product }) => {
  return (
    <NextLink href={ 'tienda' + product.slug } prefetch={ false }>
      <div className={ styles.product }>
        <div className={ styles.product__image }>
          <Image src={ product.images[0].url } alt={ product.name } width={ 400 } height={ 400 } layout='responsive' />
        </div>
        <div className={ styles.product__name }>{ product.name }</div>
        <Box display='flex' gap='.5rem'>
            <p className={ styles.product__price } style={ product.discount > 0 && product.discount <= 0.5 ? { fontSize: '1.1rem', color: '#666', textDecoration: 'line-through' } : {}}>{ format( product.price ) }</p>
            { product.discount > 0 && product.discount <= 0.5 && <p className={ styles.product__discount }>{ format( product.price * (1 - product.discount) ) }</p> }
        </Box>
        <Typography className={ styles.product__description } sx={{ display: { xs: 'none', md: 'flex' } }}>{ product.description }</Typography>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', flexGrow: 1, fontWeight: '600', color: '#8a8a8a', fontSize: '1.3rem' }}>
          <Box display='flex' flexWrap='wrap' gap='0 .5rem' alignItems='flex-end' sx={{ fontWeight: 'bold', fontSize: { xs: '1em', md: '1rem' } }}>
            {
              product.tags.map(( tag ) => <span key={ tag }>#{ tag }</span>)
            }
          </Box>
        </Box>
      </div>
    </NextLink>
  )
}
