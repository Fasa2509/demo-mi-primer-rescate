import { Facebook, Instagram, Telegram, Twitter, YouTube } from "@mui/icons-material"
import { IconButton, Typography } from "@mui/material"

import styles from './Card.module.css'

export const CardSocial = () => {

  return (
    <div className={ styles.card }>
        <Typography sx={{ fontSize: '1.15rem', fontWeight: '600' }}>¡Encuéntranos aquí!</Typography>

        <p>Mantente al tanto de nuestro proyecto, síguenos por aquí</p>

        <div className={ styles.social__container }>

            <a href="https://twitter.com/" target="_blank" rel="noreferrer">
                <IconButton>
                    <Twitter />
                </IconButton>
            </a>

            <a href="https://facebook.com/" target="_blank" rel="noreferrer">
                <IconButton>
                    <Facebook />
                </IconButton>
            </a>

            <a href="https://instagram.com/" target="_blank" rel="noreferrer">
                <IconButton>
                    <Instagram />
                </IconButton>
            </a>

            <a href="https://web.telegram.org/" target="_blank" rel="noreferrer">
                <IconButton>
                    <Telegram />
                </IconButton>
            </a>

            <a href="https://youtube.com/" target="_blank" rel="noreferrer">
                <IconButton>
                    <YouTube />
                </IconButton>
            </a>
        </div>
    </div>
  )
}
