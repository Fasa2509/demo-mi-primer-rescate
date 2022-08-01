import { PetsOutlined, ShoppingBagOutlined } from '@mui/icons-material'
import Link from 'next/link'
import styles from './Card.module.css'

export const CardShop = () => {
  return (
    <div className={ styles.card }>
        <p className={ styles.subtitle }>¿Quieres consentir a tus peludos?</p>

        <p>Visita nuestra <Link href={ '/tienda' }><a style={{ textDecoration: 'underline' }}>tienda</a></Link> y encuentra geniales artículos para los consentidos de la casa</p>

        <PetsOutlined />
        <ShoppingBagOutlined />

    </div>
  )
}
