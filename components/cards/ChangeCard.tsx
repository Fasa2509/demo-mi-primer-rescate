import { FC } from 'react';
import Image from 'next/image'

import { ModalWindow } from '../ui'
import styles from './ChangeCard.module.css'
import { getParagraphs } from '../../utils';

interface Props {
    name: string;
    text: string;
}

export const ChangeCard: FC<Props> = ({ name, text }) => {
  return (
    <div className={ styles.card__container }>
      <p className={ styles.title }>{ name }</p>
      <div className={ styles.flip__card }>
        <div>
          <Image src={ '/perro-1.webp' } alt={ 'dog-1' } width={ 300 } height={ 300 } />
        </div>
        <div>
          <Image src={ '/perro-2.webp' } alt={ 'dog-2' } width={ 300 } height={ 300 } />
        </div>
      </div>
      <ModalWindow buttonTxt={ `Historia de ${ name }` } title={ `Historia de ${ name }` }>
       {
        getParagraphs( text ).map(( txt, index ) => (
          <p key={ index }>{ txt }</p>
        ))
       }
      </ModalWindow>
    </div>
  )
}
