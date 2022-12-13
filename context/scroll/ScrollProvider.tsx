import { FC, useEffect, useState } from 'react';
import { ScrollContext } from './';

export interface ScrollState {
    passedElements: string[];
}


interface Props {
    children: JSX.Element | JSX.Element[];
    elements: ObjectToTop[];
}


export interface ObjectToTop {
    selector: string;
    distanceToTop: number;
    limit?: 'top' | 'bottom';
}


export const ScrollProvider: FC<Props> = ({ children, elements }) => {

    const [passedElements, setPassedElements] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>( false );

    useEffect(() => {
        window.addEventListener("scroll", () => {
            elements.forEach(( element ) => {
                let el = document.querySelector( element.selector ) as HTMLElement;

                if ( !el ) return;
                
                if ( element.limit ) {
                    return ( el.getClientRects()[0][element.limit] < element.distanceToTop )
                        ? setPassedElements(( prevState: string[] ) => Array.from( new Set ( [...prevState, element.selector] )) )
                        : setPassedElements(( prevState: string[] ) => prevState.filter(( el: string ) => el !== element.selector))
                } 
                
                let scroll = window.scrollY || document.documentElement.scrollTop;

                return ( element.distanceToTop < scroll )
                    ? setPassedElements(( prevState: string[] ) => Array.from( new Set( [...prevState, element.selector] ) ))
                    : setPassedElements(( prevState: string[] ) => prevState.filter(( el: string ) => el !== element.selector))
            })
        });
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

    return(
        <ScrollContext.Provider value={{
            passedElements,
            isLoading,
            setIsLoading,
        }}>
            { children }
        </ScrollContext.Provider>
    )
}








/* import { FC, useEffect, useState } from 'react';
import { ScrollContext } from './';

export interface ScrollState {
    scrolled: boolean;
}


interface Props {
    children: JSX.Element | JSX.Element[];
    selector: string;
}


export interface ObjectToTop {
    selector: string;
    distanceToTop: number;
    action?: () => void;
}


export const ScrollProvider: FC<Props> = ({ children, selector }) => {

    const [scrolled, setScrolled] = useState( false );
    const [passedImage, setpassedImage] = useState( false );

    useEffect(() => {
        window.addEventListener("scroll", () => {
          let scroll = window.scrollY || document.documentElement.scrollTop

          let image = document.documentElement.querySelector( selector )
          
          if ( image ) {
            let imgToTop = image.getClientRects()[0].bottom

            if ( imgToTop - 45 <= 0 ) setpassedImage( true )
            if ( imgToTop - 45 > 0 ) setpassedImage( false )
          }

          if ( scroll < 65 ) setScrolled( false )
          if ( scroll > 80 ) setScrolled( true )
        })
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

    return(
        <ScrollContext.Provider value={{
            scrolled,
            passedImage,
        }}>
            { children }
        </ScrollContext.Provider>
    )
} */