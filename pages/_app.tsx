import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ThemeProvider } from '@mui/material';
import { SessionProvider } from 'next-auth/react';
import { SnackbarProvider } from 'notistack';

import { lightTheme } from '../themes';
import { AuthProvider, CartProvider, MenuProvider, ScrollProvider } from '../context';
import { CloseNotificationButton } from '../utils';

function MyApp({ Component, pageProps }: AppProps) {
  return(
    <SessionProvider>
      <PayPalScriptProvider options={{ 'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '' }}>
        <ThemeProvider theme={ lightTheme }>
          <SnackbarProvider dense action={ CloseNotificationButton } maxSnack={ 4 } autoHideDuration={ 7500 }>
            <AuthProvider>
              <CartProvider>
                <MenuProvider>
                  <ScrollProvider>
                      {/* <CssBaseline /> */}
                      <Component {...pageProps} />
                  </ScrollProvider>
                </MenuProvider>
              </CartProvider>
            </AuthProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </PayPalScriptProvider>
    </SessionProvider>
  )
}

export default MyApp
