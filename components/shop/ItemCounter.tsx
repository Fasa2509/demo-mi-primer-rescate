import { FC } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";

interface Props {
  maxValue?: number;
  quantity: number;

  // Methods
  updateQuantity: ( q: number ) => void;
}

export const ItemCounter: FC<Props> = ({ quantity, updateQuantity, maxValue }) => {

  const addOrRemove = ( value: 1 | -1 ) => {
    if ( quantity <= 0 && value === -1 ) return;
    if ( maxValue && value === 1 && quantity === maxValue ) return;

    return updateQuantity( quantity + value );
    
    // if ( currentValue <= 1 && value <= -1 ) return;
    // if ( maxValue && currentValue >= maxValue && value > 0) return;

    // return ( !maxValue )
    //     ? updateQuantity( currentValue + value )
    //     : ( currentValue + value >= maxValue )
    //         ? updateQuantity( maxValue )
    //         : updateQuantity( currentValue + value )
  }

  return (
    <Box display='flex' alignItems='center' sx={{ height: '2.4rem' }}>
        <IconButton onClick={ () => addOrRemove(-1) }>
            <RemoveCircleOutline />
        </IconButton>
        <Typography sx={{ width: 40, textAlign: 'center' }}> { quantity } </Typography>
        <IconButton onClick={ () => addOrRemove(+1)} >
            <AddCircleOutline />
        </IconButton>
    </Box>
  )
}
