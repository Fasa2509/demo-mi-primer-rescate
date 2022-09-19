import { FormEvent } from "react"
import { useSnackbar } from "notistack"
import styles from './Card.module.css'

export const CardContact = () => {

    const { enqueueSnackbar } = useSnackbar();

    const handleClick = () => {
        enqueueSnackbar('¡Ahora estás suscrit@ a MPR!', { variant: 'success' })
    }
    
    return (
    <div className={ styles.card }>
        <p className={ styles.subtitle }>Mantente informado</p>

        <p>Mantente al día sobre nuestro proyecto!</p>

            <input className='input' type="text" placeholder="Ingresa tu correo" />

            <button style={{ marginBottom: 0, marginTop: '.8rem' }} className='button button--full' onClick={ handleClick }>¡Suscríbete!</button>
    </div>
  )
}
