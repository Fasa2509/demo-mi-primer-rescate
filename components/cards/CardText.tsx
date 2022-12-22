import { FC } from 'react';
import styles from './Card.module.css';

interface Props {
    text: string;
    index: number;
}

export const CardText: FC<Props> = ({ text, index }) => {
  return (
    <div className={ styles.card__goal }>
        <div className={ styles.card__number }>{ index }</div>
        <p className={ styles.card__text }>{ text }</p>
    </div>
  )
}
