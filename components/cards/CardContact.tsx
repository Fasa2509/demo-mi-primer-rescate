import { FormEvent } from "react"
import { Button, TextField } from "@mui/material"
import styles from './Card.module.css'

export const CardContact = () => {
    
    const handleSubmit = ( e: FormEvent<HTMLFormElement> ) => {
        e.preventDefault()
        window.alert('¡Ahora estás suscrito a nuestra página!')
    }
    
    return (
    <div className={ styles.card }>
        <p className={ styles.subtitle }>Mantente informado</p>

        <p>Mantente al día sobre nuestro proyecto!</p>

        <form style={{ padding: 0, marginBottom: 0 }} onSubmit={ handleSubmit }>
            {/* <input placeholder="Escribe tu correo" type="email" /> */}
            <input className='input' type="text" placeholder="Ingresa tu correo" />

            <button style={{ marginBottom: 0, marginTop: '.8rem' }} className='button button--full'>¡Suscríbete!</button>
        </form>
    </div>
  )
}
