import { FC, useState } from 'react';
import { MenuContext } from './';

export interface MenuState {
    isMenuOpen: boolean;
    confirmation: boolean | null;
}


interface props {
    children: JSX.Element
}


export const MenuProvider: FC<props> = ({ children }) => {

    const [isMenuOpen, setIsMenuOpen] = useState<boolean>( false );
    const [confirmation, setConfirmation] = useState<boolean | null>( null );

    const toggleSideMenu = () => setIsMenuOpen( !isMenuOpen );

    return (
        <MenuContext.Provider value={{
            isMenuOpen,
            toggleSideMenu,
            confirmation,
            setConfirmation,
        }}>
            { children }
        </MenuContext.Provider>
    )
}