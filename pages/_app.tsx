import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { ThemeProvider } from '@mui/material'
import { AuthProvider, MenuProvider, ScrollProvider } from '../context'
import { lightTheme } from '../themes';
import { WidthProvider } from '../context/width';

function MyApp({ Component, pageProps }: AppProps) {

  return(
    <ThemeProvider theme={ lightTheme }>
      <AuthProvider>
        <MenuProvider>
          <ScrollProvider selector='#hero-welcome'>
            <WidthProvider>
              {/* <CssBaseline /> */}
              <Component {...pageProps} />
            </WidthProvider>
          </ScrollProvider>
        </MenuProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default MyApp
