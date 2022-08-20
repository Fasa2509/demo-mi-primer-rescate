import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { ReactNotifications } from 'react-notifications-component';
import { ThemeProvider } from '@mui/material'
import { lightTheme } from '../themes';
import { AuthProvider, MenuProvider, ScrollProvider } from '../context'
import { WidthProvider } from '../context/width';

function MyApp({ Component, pageProps }: AppProps) {

  return(
    <ThemeProvider theme={ lightTheme }>
      <AuthProvider>
        <MenuProvider>
          <ScrollProvider selector='#hero-welcome'>
            <WidthProvider>
              {/* <CssBaseline /> */}
              <ReactNotifications />
              <Component {...pageProps} />
            </WidthProvider>
          </ScrollProvider>
        </MenuProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default MyApp
