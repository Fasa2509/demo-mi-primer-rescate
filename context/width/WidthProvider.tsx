import { FC, useEffect, useState } from 'react';
import { WidthContext } from './';

export type breakpoint = 'xs' | 'sm' | 'md'


interface props {
    children: JSX.Element | JSX.Element[];
}


export const WidthProvider: FC<props> = ({ children }) => {

    const [breakpoint, setBreakpoint] = useState<breakpoint>('xs');

    useEffect(() => {

        let xs = window.matchMedia('(max-width: 576px)').matches, md = window.matchMedia('(min-width: 992px)').matches;
        if ( xs ) setBreakpoint('xs')
        if ( md ) setBreakpoint('md')
        if ( !xs && !md ) setBreakpoint('sm')

        window.addEventListener('resize', e => {
            if ( window.matchMedia('(max-width: 576px)').matches ) return setBreakpoint('xs')
            if ( window.matchMedia('(min-width: 992px)').matches ) return setBreakpoint('md')
            return setBreakpoint('sm')
        })
        }, [])

    return(
        <WidthContext.Provider value={{
            breakpoint
        }}>
            { children }
        </WidthContext.Provider>
    )
}