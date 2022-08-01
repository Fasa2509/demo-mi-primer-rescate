import { useState } from 'react'

// interface Props {
//     isInitiallyOpen?: boolean;
// }

export const useModal/*: FC<Props>*/ = () => {
  
    const [isOpen, setIsOpen] = useState( false );

    const openModal = () => setIsOpen( true );

    const closeModal = () => setIsOpen( false );

    return { isOpen, openModal, closeModal }
}
