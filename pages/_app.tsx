import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from '@mui/material'
import { SessionProvider } from 'next-auth/react'
import { SnackbarProvider } from 'notistack';

import { lightTheme } from '../themes';
import { AuthProvider, CartProvider, MenuProvider, ScrollProvider } from '../context'
import { CloseNotificationButton } from '../utils';

function MyApp({ Component, pageProps }: AppProps) {
  return(
    <SessionProvider>
      <ThemeProvider theme={ lightTheme }>
        <SnackbarProvider dense action={ CloseNotificationButton } maxSnack={ 4 }>
          <AuthProvider>
            <CartProvider>
              <MenuProvider>
                <ScrollProvider elements={ [{ selector: '.scroll__button', distanceToTop: 200 }, { selector: '#hero-welcome', distanceToTop: 45, limit: 'bottom' }, { selector: '.sticks', distanceToTop: 25, limit: 'top' }] }>
                    {/* <CssBaseline /> */}
                    <Component {...pageProps} />
                </ScrollProvider>
              </MenuProvider>
            </CartProvider>
          </AuthProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}

export default MyApp
