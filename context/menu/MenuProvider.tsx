import { FC, useState } from 'react';
import { MenuContext } from './';

export interface MenuState {
    isMenuOpen: boolean;
}


interface props {
    children: JSX.Element
}


export const MenuProvider: FC<props> = ({ children }) => {

    const [isMenuOpen, setIsMenuOpen] = useState( false );

    const toggleSideMenu = () => setIsMenuOpen( !isMenuOpen )

    return(
        <MenuContext.Provider value={{
            isMenuOpen,
            toggleSideMenu,
        }}>
            { children }
        </MenuContext.Provider>
    )
}