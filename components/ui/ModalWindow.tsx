import { FC } from 'react';
import { Divider } from '@mui/material';
import { useModal } from '../../hooks';
import styles from './ModalWindow.module.css'

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
        if ( e.target.matches('.main__window *') ) return;
        closeModal();
    }

  return (
    <>
        <button style={ buttonStyle } className={ `button${ buttonClassName ? ' ' + buttonClassName : '' }` } onClick={ openModal }>{ buttonTxt }</button>
        {
            isOpen &&
            <section className={ `main__window fadeIn ${ styles.modal__window } ${ modalBg ? styles.modal__window__animation : '' }` } onClick={ handleClose }>
                <div style={ modalStyle } className={ styles.modal__container }>
                    <button className={ styles.modal__close } onClick={ closeModal }></button>
                    <p className={ styles.modal__title }>{ title }</p>

                    <Divider className={ styles.divider } />

                    <div className={ styles.modal__content }>
                        { children }
                    </div>
                </div>
            </section>
        }
    </>
  )
}
