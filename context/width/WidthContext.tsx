import { createContext } from 'react';


interface ContextProps {
    breakpoint: string;
}


export const WidthContext = createContext({} as ContextProps)