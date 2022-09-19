import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { ThemeProvider } from '@mui/material'
import { lightTheme } from '../themes';
import { SnackbarProvider } from 'notistack';
import { AuthProvider, CartProvider, MenuProvider, ScrollProvider, WidthProvider } from '../context'
import { CloseNotificationButton } from '../utils';

function MyApp({ Component, pageProps }: AppProps) {
  return(
    <ThemeProvider theme={ lightTheme }>
      <SnackbarProvider dense action={ CloseNotificationButton }>
        <AuthProvider>
          <CartProvider>
            <MenuProvider>
              <ScrollProvider elements={ [{ selector: '.scroll__button', distanceToTop: 200 }, { selector: '#hero-welcome', distanceToTop: 45, limit: 'bottom' }, { selector: '.sticks', distanceToTop: 70, limit: 'top' }] }>
                {/* <WidthProvider> */}
                  {/* <CssBaseline /> */}
                  <Component {...pageProps} />
                {/* </WidthProvider> */}
              </ScrollProvider>
            </MenuProvider>
          </CartProvider>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  )
}

export default MyApp
