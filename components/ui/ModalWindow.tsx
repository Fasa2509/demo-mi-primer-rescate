import { Divider } from '@mui/material';
import { FC } from 'react';
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
            <section className={ `main__window ${styles.modal__window}` } onClick={ handleClose }>
                <div className={ styles.modal__container }>
                    <button className={ styles.modal__close } onClick={ closeModal }></button>
                    <p className={ styles.modal__title }>{ title }</p>

                    <Divider style={{ marginTop: '.5rem', marginBottom: '.3rem' }} />

                    { children }
                </div>
            </section>
        }
    </>
  )
}
