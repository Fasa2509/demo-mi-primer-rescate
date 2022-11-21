import React, { FC } from 'react'
import styles from './Card.module.css'
import { Typography } from '@mui/material';

interface Props {
    text: string;
    index: number;
}

export const CardText: FC<Props> = ({ text, index }) => {
  return (
    <div className={ styles.card__goal }>
        <div className={ styles.card__number }>{ index }</div>
        <Typography className={ styles.card__text }>{ text }</Typography>
    </div>
  )
}
