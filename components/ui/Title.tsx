import { FC } from 'react';
import Link from 'next/link';
import { PetsOutlined } from '@mui/icons-material';
import styles from './Title.module.css';

interface Props {
    title: string;
    children: JSX.Element;
    nextPage: string;
    style?: any;
}

export const Title: FC<Props> = ({ title, children = <PetsOutlined color='info' sx={{ fontSize: '1.5rem' }} />, nextPage = '/', style = {} }) => {
    
  return (
    <Link href={ nextPage } passHref>
        <a className={ styles.container } style={ style }>
            <div className={ styles.sticks }></div>
            <div className={ styles.title }>
                <h2 className={ styles.title__text }>
                    { title }
                </h2>
                <div className={ styles.complement }>
                    { children }
                </div>
            </div>
        </a>
    </Link>
  )
}
