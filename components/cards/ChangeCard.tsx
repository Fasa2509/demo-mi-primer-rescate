import { FC } from 'react';
import { Box, Typography } from '@mui/material';

import { ModalWindow } from '../ui';
import { SliderImages } from '../slider';
import { IPet } from '../../interfaces';
import styles from './ChangeCard.module.css';

interface Props {
    pet: IPet;
}

export const ChangeCard: FC<Props> = ({ pet }) => {
  return (
    <Box className={ styles.card__container + ' observe' }>
      <Box sx={{ borderRadius: '.7rem', overflow: 'hidden', alignSelf: 'center' }}>
        <SliderImages images={ pet.images.map(( img ) => ({ url: img, alt: pet.name, width: 500, height: 500 })) } options={{ indicators: false, cycleNavigation: false, animation: 'slide', interval: 10000 }} />
      </Box>
      <p>{ pet.description }</p>
    </Box>
  )
}





/*
import { FC } from 'react';

import { ModalWindow } from '../ui'
import { SliderImages } from '../slider';
import { ImageObj } from '../../interfaces';
import { getParagraphs } from '../../utils';
import styles from './ChangeCard.module.css'

interface Props {
    name: string;
    text: string;
    images: ImageObj[];
}

export const ChangeCard: FC<Props> = ({ name, text, images }) => {
  return (
    <div className={ styles.card__container }>
      <SliderImages images={ images } options={{ indicators: false, cycleNavigation: false, animation: 'slide', autoPlay: false }} />
      <ModalWindow buttonTxt={ name } title={ `Historia de ${ name }` } buttonStyle={{ width: '100%', margin: '0' }}>
       {
        getParagraphs( text ).map(( txt, index ) => (
          <p key={ index }>{ txt }</p>
        ))
       }
      </ModalWindow>
    </div>
  )
}
*/