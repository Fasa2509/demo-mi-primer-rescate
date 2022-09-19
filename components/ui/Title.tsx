import { FC, useContext } from 'react';
import { useRouter } from "next/router"; 
import { PetsOutlined } from "@mui/icons-material";
import styles from './Title.module.css'
import { ScrollContext } from "../../context";
import Link from 'next/link';

interface Props {
    title: string;
    children: JSX.Element;
    nextPage: string;
}

export const Title: FC<Props> = ({ title, children = <PetsOutlined color='info' sx={{ fontSize: '1.5rem' }} />, nextPage }) => {
    
    const { asPath } = useRouter();
    const { passedElements } = useContext( ScrollContext );

  return (
    <Link href={ nextPage } passHref>
        <a className={ styles.container }>
            <div className={ styles.sticks + ` sticks ${ asPath === '/' && !passedElements.includes('.sticks') ? styles.inactive : '' }` }></div>
            <div className={ styles.title }>
                <h1 className={ styles.title__text }>
                    { title }
                </h1>
                <div className={ styles.complement }>
                    { children }
                </div>
            </div>
        </a>
    </Link>
  )
}
