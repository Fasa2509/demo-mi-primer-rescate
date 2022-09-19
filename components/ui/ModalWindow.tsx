import { FC } from 'react';
import { Divider } from '@mui/material';
import { useModal } from '../../hooks';
import styles from './ModalWindow.module.css'

interface Props {
    children: JSX.Element | JSX.Element[];
    buttonTxt?: string;
    title: string;
    buttonStyle?: any;
}

export const ModalWindow: FC<Props> = ({ children, buttonTxt = 'Abrir', title, buttonStyle = {} }) => {

    const { isOpen, openModal, closeModal } = useModal();

    const handleClose = ( e: any ) => {
        if ( e.target.matches('.main__window *') ) return;
        closeModal();
    }

  return (
    <>
        <button style={ buttonStyle } className='button' onClick={ openModal }>{ buttonTxt }</button>
        {
            isOpen &&
            <section className={ `main__window fadeIn ${ styles.modal__window }` } onClick={ handleClose }>
                <div className={ styles.modal__container }>
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
