import { FC } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutline from "@mui/icons-material/RemoveCircleOutline";

interface Props {
  maxValue: number;
  quantity: number;

  // Methods
  updateQuantity: ( q: number ) => void;
}

export const ItemCounter: FC<Props> = ({ quantity, updateQuantity, maxValue }) => {

  const addOrRemove = ( value: 1 | -1 ) => {
    if ( maxValue === -1 ) return;
    if ( quantity < 1 && value === -1 ) return;
    if ( value === 1 && quantity >= maxValue ) return updateQuantity( maxValue );
    if ( value === -1 && quantity > maxValue ) return updateQuantity( maxValue );

    return updateQuantity( quantity + value );
  }

  return (
    <Box display='flex' alignItems='center' sx={{ height: '2.4rem' }}>
        <IconButton onClick={ () => addOrRemove(-1) }>
            <RemoveCircleOutline />
        </IconButton>
        <Typography sx={{ width: 40, textAlign: 'center', color: quantity === maxValue ? '#9933b3' : '' }}> { quantity } </Typography>
        <IconButton onClick={ () => addOrRemove(+1)} >
            <AddCircleOutline />
        </IconButton>
    </Box>
  )
}
