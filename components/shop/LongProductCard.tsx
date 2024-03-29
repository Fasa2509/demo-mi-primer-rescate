import { FC, useMemo } from 'react';
import { Box, Typography, Chip } from '@mui/material';

import { MyImage } from '../cards';
import { format } from '../../utils';
import { IProduct } from '../../interfaces';
import styles from './ProductCard.module.css';

interface Props {
    product: IProduct;
    navigateTo: ( query: string ) => void;
}

export const LongProductCard: FC<Props> = ({ product, navigateTo }) => {

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const q = useMemo(() => Object.values( product.inStock ).filter(c => typeof c === 'number').reduce(( prev, quantity) => prev + quantity, 0), []);

  return (
      <div className={ styles.product__long } onClick={ () => navigateTo(`?product=${ product.slug.replace('/', '') }`) }>
        <div className={ styles.product__long__image }>
          <Box sx={{ position: 'relative', height: { xs: '145px', sm: '200px' } }}>
              <MyImage src={ product.images[0].url } alt={ product.name } width={ 1 } height={ 1 } layout='responsive' />
          </Box>
          { q <= 10 &&
            <Chip
              color='warning'
              label='Quedan pocos'
              variant='outlined'
              sx={{ position: 'absolute', zIndex: 99, bottom: '.5rem', right: '.5rem', fontSize: '14px' }}
            />
          }
        </div>
        <div className={ styles.product__info }>
          <Typography sx={{ fontWeight: '600', fontSize: '1.15rem' }}>{ product.name }</Typography>
          <Box display='flex' gap='.5rem'>
            <p className={ styles.product__price } style={ product.discount > 0 && product.discount <= 0.5 ? { fontSize: '1.1rem', color: '#666', textDecoration: 'line-through' } : {}}>{ format( product.price ) }</p>
            { product.discount > 0 && product.discount <= 0.5 && <p className={ styles.product__discount }>{ format( product.price - product.discount * product.price ) }</p> }
          </Box>
          <p className={ styles.product__long__description }>{ product.description }</p>
          <Box className={ styles.product__long__tags } sx={{ display: 'flex' }}>
            <Box display='flex' flexWrap='wrap' justifyContent='flex-end' gap='0 .5rem'>
            {
              product.tags.map(( tag ) => <span key={ tag }>#{ tag }</span>)
            }
            </Box>
          </Box>
        </div>
      </div>
  )
}
