import { PetsOutlined, ShoppingBagOutlined } from '@mui/icons-material'
import { Typography } from '@mui/material'
import Link from 'next/link'
import styles from './Card.module.css'

export const CardShop = () => {
  return (
    <div className={ styles.card }>
        <Typography sx={{ fontSize: '1.15rem', fontWeight: '600' }}>¿Buscas consentir a tus peludos?</Typography>

        <Typography>Visita nuestra <Link href={ '/tienda' }><a style={{ textDecoration: 'underline', fontWeight: 'bold' }}>tienda</a></Link> y encuentra geniales artículos para los consentidos de la casa</Typography>

        <div>
          <PetsOutlined />
          <ShoppingBagOutlined />
        </div>

    </div>
  )
}
