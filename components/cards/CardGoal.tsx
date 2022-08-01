import { FC, useState } from 'react';
import styles from './Card.module.css'

interface Props {
    index: number;
    txt: string;
    initiallyDisplayed?: boolean;
    style?: any;
}

export const CardGoal: FC<Props> = ({ index, txt, initiallyDisplayed = false, style }) => {

    const [active, setActive] = useState( initiallyDisplayed );

  return (
    <div style={{ ...style }} className={ `${ styles.goal }${ active ? ` ${ styles.active }` : '' }` } onClick={ () => setActive( !active ) }>
      <div className={ styles.goal__number }>
        { index + 1 }.
        <div className={ styles.wings }></div>
      </div>
      <div className={ styles.goal__text }>{ txt }</div>
    </div>
  )
}
