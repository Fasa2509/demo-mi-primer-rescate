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
        
        const resizeObserver = new ResizeObserver(( entries ) => {
            entries.forEach(entry => setMargin( `-${ window.getComputedStyle( element! ).height }` ) )
        });

        resizeObserver.observe( element! );
    }, [ title ])

  return (
    <section className={ styles.container }>
        <div className={ styles.title__container + `${ display ? ` ${ styles.active }` : '' }` } onClick={ () => setDisplay( !display ) }>
            <p className={ styles.title__text }>{ title }</p>
            <div className={ styles.wings + `${ display ? ` ${ styles.active }` : '' }` }></div>
        </div>
        <section id={ title } style={{ marginTop: display ? '0' : margin, backgroundImage: 'url(/wave-haikei-1.svg)', backgroundSize: 'cover', backgroundPosition: 'bottom left', backgroundRepeat: 'no-repeat', ...style }} className={ styles.content + `${ display ? ` ${ styles.display }` : '' }` }>
            { children }
            {/* <div className={ styles.background }></div> */}
            {/* <svg id="visual" viewBox="0 0 900 600" width="900" height="600" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1"><path d="M0 491L12.5 493.8C25 496.7 50 502.3 75 509.3C100 516.3 125 524.7 150 526.8C175 529 200 525 225 518.2C250 511.3 275 501.7 300 500.8C325 500 350 508 375 511C400 514 425 512 450 510.3C475 508.7 500 507.3 525 510C550 512.7 575 519.3 600 524C625 528.7 650 531.3 675 526C700 520.7 725 507.3 750 500.8C775 494.3 800 494.7 825 500.2C850 505.7 875 516.3 887.5 521.7L900 527L900 601L887.5 601C875 601 850 601 825 601C800 601 775 601 750 601C725 601 700 601 675 601C650 601 625 601 600 601C575 601 550 601 525 601C500 601 475 601 450 601C425 601 400 601 375 601C350 601 325 601 300 601C275 601 250 601 225 601C200 601 175 601 150 601C125 601 100 601 75 601C50 601 25 601 12.5 601L0 601Z" strokeLinecap="round" strokeLinejoin="miter"></path></svg> */}
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