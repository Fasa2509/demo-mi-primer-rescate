import { FC } from 'react';
import { Box, Button } from '@mui/material';
import { Sizes, InStockSizes } from '../../interfaces/products';

interface Props {
    inStock: InStockSizes;
    selectedSize: Sizes | undefined;
    setSelectedSize: ( s: Sizes ) => void;
}

export const SizeSelector: FC<Props> = ({ inStock, selectedSize, setSelectedSize }) => {
    
    let sizes = Object.entries( inStock ).filter(s => Number(s[1]) >= 1).map(s => s[0]);

    if ( sizes.length === 0 ) return <></>;

  return (
    <Box display='flex' gap='.5rem' flexWrap='wrap'>
        {
            sizes.map( size => (
                    <Button
                        key={ size }
                        size='small'
                        color={ selectedSize === size ? 'secondary' : 'info' }
                        onClick={ () => setSelectedSize( size as Sizes ) }
                    >
                        { size }
                    </Button>
            ))
        }
    </Box>
  )
}
