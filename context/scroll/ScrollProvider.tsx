import { FC, useState } from 'react';
import { ScrollContext } from './';


interface Props {
    children: JSX.Element | JSX.Element[];
}


export const ScrollProvider: FC<Props> = ({ children }) => {

    const [isLoading, setIsLoading] = useState<boolean>( false );

    return(
        <ScrollContext.Provider value={{
            // passedElements,
            isLoading,
            setIsLoading,
        }}>
            { children }
        </ScrollContext.Provider>
    )
}
