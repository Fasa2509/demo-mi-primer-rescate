import { FC, useEffect, useState } from 'react';
import styles from './Slider.module.css';

interface Props {
    children: JSX.Element[];
    identifier: string;
    duration?: number;
}

export const Slider: FC<Props> = ({ children, identifier, duration = 7500 }) => {

    const [elements, setElements] = useState<HTMLElement[]>([]);
    const [active, setActive] = useState( 0 );
    const [buttonsDisabled, setButtonsDisabled] = useState( false );

    useEffect(() => {
        const els = document.querySelectorAll(`#${ identifier } > div`);
        // @ts-ignore
        setElements( Array.from( els ) );
        els[0].classList.add( styles.active );

        let interval = setInterval(() => setActive(( prevState ) => ( prevState === children.length - 1 )
            ? 0
            : prevState += 1
        ), duration);
        
        return () => clearInterval( interval );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() =>
            elements.forEach(( el, index ) =>
                ( index === active )
                    ? el.classList.add( styles.active )
                    : el.classList.remove( styles.active )
            )
    // eslint-disable-next-line react-hooks/exhaustive-deps
    , [active]);

    const passElement = ( pass: 1 | -1 ) => {
        setButtonsDisabled( true );
        setTimeout(() => setButtonsDisabled( false ), 500);
        setActive(( prevState ) => {
            if ( prevState === children.length - 1 && pass === 1 ) return 0;
            if ( prevState === 0 && pass === -1 ) return children.length - 1;

            return prevState += pass;
        });
    }

    return (
        <section id={ identifier } className={ styles.container }>
            { children }
            <div className={ styles.buttons__container }>
                <button className={ `${ styles.pass__button } ${ styles.left }` } disabled={ buttonsDisabled } onClick={ () => passElement( -1 ) }></button>
                <button className={ `${ styles.pass__button } ${ styles.right }` } disabled={ buttonsDisabled } onClick={ () => passElement( 1 ) }></button>
            </div>
        </section>
    )
}