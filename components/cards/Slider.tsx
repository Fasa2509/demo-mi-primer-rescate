import { FC, useEffect, useState } from 'react';
import styles from './Slider.module.css';

interface Props {
    children: JSX.Element[];
    identifier: string;
}

export const Slider: FC<Props> = ({ children, identifier }) => {

    const [elements, setElements] = useState<HTMLElement[]>([]);
    const [active, setActive] = useState( 0 );

    useEffect(() => {
        const els = document.querySelectorAll(`#${ identifier } > div`);
        // @ts-ignore
        setElements( Array.from( els ) );
        els[0].classList.add( styles.active )
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        elements.forEach(( el, index ) =>
            ( index === active )
                ? el.classList.add( styles.active )
                : el.classList.remove( styles.active )
        )
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active]);

    const passElement = ( pass: 1 | -1 ) => {
        setActive(( prevState ) => {
            if ( prevState === children.length - 1 && pass === 1 ) return 0;
            if ( prevState === 0 && pass === -1 ) return children.length - 1;

            return prevState += pass;
        });
    }

    return (
        <section id={ identifier } className={ styles.container }>
            { children }
            <button className={ `${ styles.pass__button } ${ styles.left }` } onClick={ () => passElement( -1 ) }>{ '<' }</button>
            <button className={ `${ styles.pass__button } ${ styles.right }` } onClick={ () => passElement( 1 ) }>{ '>' }</button>
        </section>
    )
}