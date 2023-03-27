import { FC } from 'react';
import NextLink from 'next/link';
import PetsOutlined from '@mui/icons-material/PetsOutlined';
import styles from './Title.module.css';

interface Props {
    title: string;
    children: JSX.Element;
    nextPage: string;
    index?: boolean;
    style?: any;
}

export const Title: FC<Props> = ({ title, children = <PetsOutlined color='info' sx={{ fontSize: '1.5rem' }} />, nextPage = '/', index, style = {} }) => {

  return (
    <NextLink href={ nextPage } passHref>
        <a className={ styles.container } style={ style }>
            <div id='sticks' className={ `${ styles.sticks }${ index ? ' sticks__inactive' : '' }` }></div>
            <div className={ styles.title }>
                <h2 className={ styles.title__text }>
                    { title }
                </h2>
                <div className={ styles.complement }>
                    { children }
                </div>
            </div>
        </a>
    </NextLink>
  )
}
