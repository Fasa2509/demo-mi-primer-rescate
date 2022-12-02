import { FC } from "react";
import { createPortal } from "react-dom";
import { Divider } from "@mui/material";
import styles from './ModalWindow.module.css';

interface Props {
    children: JSX.Element | JSX.Element[];
    title: string;
    modalStyle?: any;
    modalBg?: boolean;
    closeModal: (e: any) => void;
}

export const ModalContent: FC<Props> = ({ children, title, modalStyle = {}, modalBg = true, closeModal }) => {

    return createPortal(
        <section className={ `main__window fadeIn ${ styles.modal__window } ${ modalBg ? styles.modal__window__animation : '' }` } onClick={ closeModal }>
            <div style={ modalStyle } className={ styles.modal__container }>
                <button className={ `${ styles.modal__close } button__close` } onClick={ closeModal }></button>
                <p className={ styles.modal__title }>{ title }</p>
                
                <Divider className={ styles.divider } />
                
                <div className={ styles.modal__content }>
                    { children }
                </div>
            </div>
        </section>, document.getElementById('portal')!
    )
}