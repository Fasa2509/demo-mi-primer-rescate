import { FC, useEffect, useState } from "react";
import styles from './ContentSlider.module.css'

interface Props {
    children: JSX.Element | JSX.Element[];
    title: string;
    initiallyDisplayed?: boolean;
    style?: any;
}

export const ContentSlider: FC<Props> = ({ children, title, initiallyDisplayed = false, style = {} }) => {

    const [ margin, setMargin ] = useState<string>( '-9999px' );
    const [ display, setDisplay ] = useState<boolean>( initiallyDisplayed );

    useEffect(() => {
        // aqui actualizamos la variable de estado margin a la altura exacta del elemento
        const element = document.getElementById( title )
        
        const resizeObserver = new ResizeObserver(( entries ) =>
            entries.forEach(() => setMargin( `-${ window.getComputedStyle( element! ).height }` ) ));

        resizeObserver.observe( element! );

        return () => resizeObserver.disconnect();
    }, [ title ]);

  return (
    <section className={ styles.container }>
        <div className={ styles.title__container + `${ display ? ` ${ styles.active }` : '' }` } onClick={ () => setDisplay( !display ) }>
            <p className={ styles.title__text }>{ title }</p>
            <div className={ styles.wings + `${ display ? ` ${ styles.active }` : '' }` }></div>
        </div>
        <section id={ title } style={{ marginTop: display ? '0' : margin, backgroundImage: 'url(/wave-haikei-1.svg)', backgroundSize: '120%', backgroundPosition: 'bottom left', backgroundRepeat: 'no-repeat', ...style }} className={ styles.content + `${ display ? ` ${ styles.display }` : '' }` }>
            { children }
        </section>
    </section>
  )
}




















// import { FC, useContext, useEffect, useState } from 'react';

// import styles from './ContentSlider.module.css'
// import { WidthContext } from '../../context';

// interface Props {
//     children: JSX.Element | JSX.Element[];
//     title: string;
//     initiallyDisplayed?: boolean;
//     style?: any;
// }

// export const ContentSlider: FC<Props> = ({ children, title, initiallyDisplayed = false, style }) => {

//     const [display, setDisplay] = useState( initiallyDisplayed );
//     const { breakpoint } = useContext( WidthContext );
//     // el margin-top inicial es -9999px para que el children siempre inicie muy arriba y no se vea
//     const [margin, setMargin] = useState( '-9999px' );

//     useEffect(() => {
//         // aqui actualizamos la variable de estado margin a la altura exacta del elemento
//         // const element = document.getElementById( title )
//         setMargin( `-${window.getComputedStyle( document.getElementById( title )! ).height}` )
//     }, [ title, breakpoint ])

//   return (
//     <section className={ styles.container }>
//         <div className={ `${styles.title__container}${ display ? ` ${ styles.active }` : '' }` } onClick={ () => setDisplay( !display ) }>
//             <p className={ styles.title }>{ title }</p>
//             <div className={ `${ styles.wings }${ display ? ` ${ styles.active }` : '' }` }></div>
//         </div>
//         <section style={{ marginTop: !display ? margin : '0', ...style }} className={ `${ styles.content }${ display ? ` ${ styles.display }` : '' }` } id={ title }>
//             { children }
//         </section>
//     </section>
//   )
// }