import { FC } from 'react';
import { useModal } from '../../hooks';
import { ModalContent } from './ModalContent';

interface Props {
    children: JSX.Element | JSX.Element[];
    buttonTxt?: string;
    title: string;
    buttonClassName?: string;
    buttonStyle?: any;
    modalStyle?: any;
    modalBg?: boolean;
}

export const ModalWindow: FC<Props> = ({ children, buttonTxt = 'Abrir', title, buttonClassName, buttonStyle = {}, modalStyle = {}, modalBg = true }) => {

    const { isOpen, openModal, closeModal } = useModal();

    const handleClose = ( e: any ) => {
        if ( e.target.matches('.main__window .button__close') ) closeModal();
        if ( e.target.matches('.main__window *') ) return;
        closeModal();
    }

    return (
        <>
            <button style={ buttonStyle } className={ `button${ buttonClassName ? ` ${ buttonClassName }` : '' }` } onClick={ openModal }>{ buttonTxt }</button>
            { isOpen && <ModalContent title={ title } modalStyle={ modalStyle } modalBg={ modalBg } closeModal={ handleClose }>{ children }</ModalContent> }
        </>
  )
}
