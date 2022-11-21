import { FC } from 'react';
import { Card, CardMedia, Typography } from '@mui/material';
import { ModalWindow } from '../ui';
import { IPet } from '../../interfaces';
import { MyImage } from './MyImage';

export interface Props {
    pet: IPet;
}

export const PetCard: FC<Props> = ({ pet }) => {
  return (
        <Card sx={{ position: 'relative', height: 'auto' }}>
            <CardMedia
                component='img'
                className='fadeIn'
                image={ pet.images[0] }
                alt={ pet.name }
            />
            {/* <MyImage src={ pet.images[0] } alt={ pet.name } width={ 500 } height={ 500 } /> */}

            <ModalWindow title={ pet.name } buttonTxt={ pet.name } buttonStyle={{ position: 'absolute', right: '.5rem', bottom: '.7rem', borderRadius: '10rem' }}>
                <Typography>{ pet.description }</Typography>
            </ModalWindow>
        </Card>
  )
}