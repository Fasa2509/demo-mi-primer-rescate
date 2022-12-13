import { FC } from 'react';
import Image from 'next/image';
import NextLink from 'next/link';

import { format } from '../../utils';
import { IProduct } from '../../interfaces';
import { Box, Typography } from '@mui/material';
import styles from './ProductCard.module.css';

interface Props {
    product: IProduct;
}

export const BigProductCard: FC<Props> = ({ product }) => {
  return (
    <NextLink href={{
      pathname: '/tienda',
      query: { product: product.slug.replace('/', '') },
    }} scroll={ false } prefetch={ false } shallow>
      <Box className={ styles.big__product__info } display='flex' flexDirection='column'>
        <Box className={ styles.big__product__image }>
          <Image src={ product.images[0].url } alt={ product.name } width={ 1 } height={ 1 } layout='responsive' />
        </Box>
        <Box display='flex' flexDirection='column' flexGrow='1' sx={{ boxShadow: '0 0 1.2rem -.6rem #444', padding: '.7rem', borderRadius: '.7rem', backgroundColor: '#fafafa', paddingTop: '2.7rem', marginTop: '-2.3rem' }}>
          <Typography sx={{ fontWeight: '600', fontSize: '1.1rem', lineHeight: '1.15' }}>{ product.name }</Typography>
          <Box display='flex' gap='.5rem'>
            <p className={ `${ styles.big__product__price }${ product.discount > 0 && product.discount <= 0.5 ? ` ${ styles.big__product__price__d }` : '' }` }>{ format( product.price ) }</p>
            { product.discount > 0 && product.discount <= 0.5 && <p className={ styles.big__product__discount }>{ format( product.price * (1 - product.discount) ) }</p> }
          </Box>
          <Box flexGrow='1'></Box>
          <Box display='flex' gap='.5rem' alignSelf='flex-end' sx={{ justifySelf: 'flex-end', fontSize: { xs: '1rem', md: '.9rem' }, fontWeight: '600', color: '#666' }}>
          {
            product.tags.map(( tag ) => <span key={ tag }>#{ tag }</span>)
          }
          </Box>
        </Box>
      </Box>
    </NextLink>
  )
}


// export const BigProductCard: FC<Props> = ({ product }) => {
//   return (
//     <NextLink href={ '/tienda' + product.slug } prefetch={ false }>
//       <div className={ styles.big__product }>
//         <div className={ styles.big__product__image }>
//           <Image src={ product.images[0].url } alt={ product.name } width={ 400 } height={ 400 } layout='responsive' />
//         </div>
//         <div className={ styles.big__product__name }>{ product.name }</div>
//         <Box display='flex' gap='.5rem'>
//             <p className={ styles.big__product__price } style={ product.discount > 0 && product.discount <= 0.5 ? { fontSize: '1.1rem', color: '#666', textDecoration: 'line-through' } : {}}>{ format( product.price ) }</p>
//             { product.discount > 0 && product.discount <= 0.5 && <p className={ styles.big__product__discount }>{ format( product.price * (1 - product.discount) ) }</p> }
//         </Box>
//         <Typography className={ styles.big__product__description } sx={{ display: { xs: 'none', md: 'flex' } }}>{ product.description }</Typography>
//         <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', flexGrow: 1, fontWeight: '600', color: '#8a8a8a', fontSize: '1.3rem' }}>
//           <Box display='flex' flexWrap='wrap' gap='0 .5rem' alignItems='flex-end' sx={{ fontWeight: 'bold', fontSize: { xs: '1em', md: '1rem' } }}>
//             {
//               product.tags.map(( tag ) => <span key={ tag }>#{ tag }</span>)
//             }
//           </Box>
//         </Box>
//       </div>
//     </NextLink>
//   )
// }
