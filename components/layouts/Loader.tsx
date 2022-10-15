import { FC, useContext } from 'react';
import { ScrollContext } from '../../context';
import styles from './Loader.module.css';

export const Loader: FC = () => {

  const { isLoading } = useContext( ScrollContext );

  return (
    <div className={ `${ styles.loader }${isLoading ? ' ' + styles.loader__active : ''}` }>
        <div className={ styles.print }></div>
    </div>
  )
}
