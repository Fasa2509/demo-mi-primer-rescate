import { FC, useContext, useState } from 'react';
import NextLink from 'next/link';
import { useSnackbar } from 'notistack';
import { Box, IconButton, Link, Typography } from "@mui/material";
import Facebook from '@mui/icons-material/Facebook';
import Instagram from '@mui/icons-material/Instagram';
import Telegram from '@mui/icons-material/Telegram';
import Twitter from '@mui/icons-material/Twitter';
import YouTube from '@mui/icons-material/YouTube';
import WhatsApp from '@mui/icons-material/WhatsApp';
import PetsOutlined from '@mui/icons-material/PetsOutlined';
import ShoppingBagOutlined from '@mui/icons-material/ShoppingBagOutlined';

import { AuthContext, ScrollContext } from '../../context';
import { mprApi } from "../../mprApi";
import { validations } from "../../utils";
import styles from './Footer.module.css';
import cardStyles from '../cards/Card.module.css';

export const Footer: FC = () => {

  const { user } = useContext(AuthContext);
  const { setIsLoading } = useContext(ScrollContext);
  const { enqueueSnackbar } = useSnackbar();
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleClick = async () => {

    if (isSubscribed) return enqueueSnackbar('¡Ahora estás suscrit@ a MPR!', { variant: 'success' });
    if (!user) return enqueueSnackbar('Inicia sesión para suscribirte a MPR', { variant: 'warning' });
    if (!validations.isValidEmail(user.email)) return enqueueSnackbar('El correo no es válido', { variant: 'warning' });

    try {
      setIsLoading(true);
      const { data } = await mprApi.post('/contact', { email: user?.email });
      setIsLoading(false);

      !data.error && setIsSubscribed(true);

      enqueueSnackbar(data.message, { variant: !data.error ? 'success' : 'error' });
    } catch (error) {
      setIsLoading(false);
      // @ts-ignore
      enqueueSnackbar(error.response ? error.response.data.message || 'Ocurrió un error' : 'Ocurrió un error', { variant: 'error' });
    }
  }

  const share = async () => {
    try {
      await navigator.share({
        title: '¡Visita la página de Mi Primer Rescate!',
        text: 'Mira su trabajo y participa en sus eventos',
        url: `${process.env.NEXT_PUBLIC_DOMAIN_NAME}`,
      });
    } catch (error) {
      enqueueSnackbar('No se pudo compartir', { variant: 'warning' });
    }
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.shape__divider}>
        <div className={styles.custom__shape__divider__bottom}>
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className={styles.shape__fill}></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className={styles.shape__fill}></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className={styles.shape__fill}></path>
          </svg>
        </div>
      </div>

      <Box sx={{ width: '96%', margin: '.5rem auto .7rem' }}>
        <p className={styles.p}>¡Comparte nuestro contenido para llegar a más personas!</p>
        <div className={styles.share__container}>
          <Link href={`https://www.facebook.com/sharer.php?u=${process.env.NEXT_PUBLIC_DOMAIN_NAME}&t=¡Visita la página de Mi Primer Rescate!`} target='_blank' rel='noreferrer' className={`${styles.share__button} ${styles.facebook}`}><Facebook color='info' sx={{ fontSize: '1.5rem' }} /></Link>
          <button className={`${styles.share__button} ${styles.instagram}`} onClick={share}><Instagram color='info' sx={{ fontSize: '1.5rem' }} /></button>
          <Link href={`https://twitter.com/intent/tweet?text=¡Visita la página de Mi Primer Rescate!&url=${process.env.NEXT_PUBLIC_DOMAIN_NAME}`} target='_blank' rel='noreferrer' className={`${styles.share__button} ${styles.twitter}`}><Twitter color='info' sx={{ fontSize: '1.5rem' }} /></Link>
          <Link href={`https://api.whatsapp.com/send?text=¡Visita la página de Mi Primer Rescate! ${process.env.NEXT_PUBLIC_DOMAIN_NAME}`} target='_blank' rel='noreferrer' className={`${styles.share__button} ${styles.whatsapp}`}><WhatsApp color='info' sx={{ fontSize: '1.5rem' }} /></Link>
        </div>
      </Box>

      <section className={styles.footer__card}>

        <div className={cardStyles.card}>
          <Typography sx={{ fontSize: '1.15rem', fontWeight: '600' }}>Mantente informado</Typography>

          <p>¡Sigue al día sobre nuestro proyecto!</p>
          <p>Recibe información exclusiva de nuestra fundación en tu correo</p>

          <button style={{ marginBottom: 0, marginTop: '.8rem' }} className='button' onClick={handleClick}>¡Suscríbete!</button>
        </div>

        <div className={cardStyles.card}>
          <Typography sx={{ fontSize: '1.15rem', fontWeight: '600' }}>¡Encuéntranos aquí!</Typography>
          <p>Mantente al tanto de nuestro proyecto, síguenos también por aquí</p>

          <div className={cardStyles.social__container}>
            <a href="https://facebook.com/people/Fundaci%C3%B3n-Mi-Primer-Rescate/100079585354684/" target="_blank" rel="noreferrer">
              <IconButton>
                <Facebook />
              </IconButton>
            </a>
            <a href="https://instagram.com/miprimerrescate?igshid=MzMyNGUyNmU2YQ==" target="_blank" rel="noreferrer">
              <IconButton>
                <Instagram />
              </IconButton>
            </a>
            <a href="https://www.youtube.com/@MiPrimerRescate" target="_blank" rel="noreferrer">
              <IconButton>
                <YouTube />
              </IconButton>
            </a>
          </div>
        </div>

        <div className={cardStyles.card}>
          <Typography sx={{ fontSize: '1.15rem', fontWeight: '600' }}>¿Buscas consentir a tus peludos?</Typography>
          <p>Visita nuestra <NextLink href={'/tienda'}><a style={{ textDecoration: 'underline', fontWeight: 'bold' }}>tienda</a></NextLink> y encuentra geniales artículos para los consentidos de la casa</p>
          <div>
            <PetsOutlined />
            <ShoppingBagOutlined />
          </div>
        </div>

      </section>
    </footer>
  )
}
