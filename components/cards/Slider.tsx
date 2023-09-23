import { FC, useEffect, useState, useRef } from 'react';
import styles from './Slider.module.css';

interface Props {
    children: JSX.Element[];
    identifier: string;
    duration?: number;
    autorun?: boolean;
}

export const Slider: FC<Props> = ({ children, identifier, duration = 7500, autorun = true }) => {

    const [elements, setElements] = useState<HTMLElement[]>([]);
    const [active, setActive] = useState(0);
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval>>(null);

    useEffect(() => {
        // @ts-ignore
        // if (autorun) intervalRef.current = setInterval(() => setActive((prevState) => (prevState === children.length - 1)
        //     ? 0
        //     : prevState += 1
        // ), duration);

        // return () => clearInterval(intervalRef.current ? intervalRef.current : setInterval(() => { }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const els = document.querySelectorAll(`#${identifier} > div`);
        // @ts-ignore
        setElements(Array.from(els));
        els[0] && els[0].classList.add(styles.active);

        if (!autorun) setActive(els.length - 1)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [children])

    useEffect(() =>
        elements.forEach((el, index) =>
            (index === active)
                ? el.classList.add(styles.active)
                : el.classList.remove(styles.active)
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
        , [active]);

    const passElement = (pass: 1 | -1) => {
        setButtonsDisabled(true);
        setTimeout(() => setButtonsDisabled(false), 500);
        setActive((prevState) => {
            if (prevState === children.length - 1 && pass === 1) return 0;
            if (prevState === 0 && pass === -1) return children.length - 1;

            return prevState += pass;
        });
    }

    return (
        <section id={identifier} className={styles.container}>
            {children}
            <section className={styles.buttons__container}>
                <button className={`${styles.pass__button} ${styles.left}`} disabled={buttonsDisabled} onClick={() => passElement(-1)}></button>
                <button className={`${styles.pass__button} ${styles.right}`} disabled={buttonsDisabled} onClick={() => passElement(1)}></button>
            </section>
        </section>
    )
}


/*
import { FC, useEffect, useState, useRef } from 'react';
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
    const intervalRef = useRef<ReturnType<typeof setInterval>>( null );

    useEffect(() => {
        // @ts-ignore
        intervalRef.current = setInterval(() => setActive(( prevState ) => ( prevState === children.length - 1 )
            ? 0
            : prevState += 1
        ), duration);
        
        return () => clearInterval( intervalRef.current! );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if ( children.length === elements.length ) return;

        const els = document.querySelectorAll(`#${ identifier } > div`);
        // @ts-ignore
        setElements( Array.from( els ) );
        els[0].classList.add( styles.active );

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ children ])

    useEffect(() =>
            elements.forEach(( el, index ) =>
                ( index === active )
                    ? el.classList.add( styles.active )
                    : el.classList.remove( styles.active )
            )
    // eslint-disable-next-line react-hooks/exhaustive-deps
    , [active]);

    const passElement = ( pass: 1 | -1 ) => {
        clearInterval( intervalRef.current! );
        setButtonsDisabled( true );
        setTimeout(() => setButtonsDisabled( false ), 500);
        setActive(( prevState ) => {
            if ( prevState === children.length - 1 && pass === 1 ) return 0;
            if ( prevState === 0 && pass === -1 ) return children.length - 1;

            return prevState += pass;
        });

        // @ts-ignore
        intervalRef.current = setInterval(() => setActive(( prevState ) => ( prevState === children.length - 1 )
            ? 0
            : prevState += 1
        ), duration);
    }

    return (
        <section id={ identifier } className={ styles.container }>
            { children }
            <section className={ styles.buttons__container }>
                <button className={ `${ styles.pass__button } ${ styles.left }` } disabled={ buttonsDisabled } onClick={ () => passElement( -1 ) }></button>
                <button className={ `${ styles.pass__button } ${ styles.right }` } disabled={ buttonsDisabled } onClick={ () => passElement( 1 ) }></button>
            </section>
        </section>
    )
}
*/