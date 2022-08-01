import { FC, useEffect, useState } from 'react';
import { ScrollContext } from './';

export interface ScrollState {
    scrolled: boolean;
}


interface props {
    children: JSX.Element | JSX.Element[];
    selector: string;
}


export const ScrollProvider: FC<props> = ({ children, selector }) => {

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
}