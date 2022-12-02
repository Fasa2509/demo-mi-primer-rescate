import { FC } from 'react';
import { Box } from '@mui/material';

import { SliderImages } from '../slider';
import { IPet } from '../../interfaces';
import { getParagraphs } from '../../utils';
import styles from './ChangeCard.module.css';

interface Props {
    pet: IPet;
    observe?: boolean;
}

export const ChangeCard: FC<Props> = ({ pet, observe = false }) => {
  return (
    <Box className={ `${ styles.card__container }${ observe ? ` observe ${ styles.card__appear }` : '' }` }>
      <Box sx={{ borderRadius: '.5rem', overflow: 'hidden', alignSelf: 'flex-start' }}>
        <SliderImages images={ pet.images.map(( img ) => ({ url: img, alt: pet.name, width: 500, height: 500 })) } options={{ indicators: false, cycleNavigation: false, animation: 'slide', interval: 12000 }} />
      </Box>
      <Box>
        <p className={ styles.pet__name }>{ pet.name }</p>
        {
          getParagraphs( pet.description ).map(( paragraph, index ) => <p key={ index }>{ paragraph }</p>)
        }
      </Box>
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