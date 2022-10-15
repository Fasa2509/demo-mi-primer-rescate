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
      <SliderImages images={ images } options={{ indicators: false, cycleNavigation: false, animation: 'slide', interval: 8000 }} />
      <ModalWindow buttonTxt={ name } title={ `Historia de ${ name }` } buttonStyle={{ borderRadius: 0 }}>
        {
          getParagraphs( text ).map(( txt, index ) => (
            <p key={ index }>{ txt }</p>
          ))
        }
      </ModalWindow>
    </div>
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