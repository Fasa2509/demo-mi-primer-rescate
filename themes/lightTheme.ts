import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 576,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  typography: {
    fontFamily: [
      "Roboto",
      "sans-serif",
      "Nunito",
      "Helvetica Neue",
      "Arial",
    ].join(",")
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#B74FD1',
    },
    secondary: {
      main: '#ff4f0d',
    },
    info: {
      main: '#fafafa',
    },
  },
  components: {
    MuiLink: {
      defaultProps: {
        underline: 'none',
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        position: 'fixed',
      },
      styleOverrides: {
        root: {
          backgroundColor: 'white',
          height: 60
        },
      }
    },

    MuiTypography: {
      styleOverrides: {
        h1: {
          fontSize: 30,
          fontWeight: 600
        },
        h2: {
          fontSize: 20,
          fontWeight: 400
        },
        subtitle1: {
          fontSize: 18,
          fontWeight: 600
        }
      }
    },


    MuiButton: {
      defaultProps: {
        variant: 'contained',
        size: 'small',
        disableElevation: true,
        color: 'info'
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          boxShadow: 'none',
          borderRadius: 10,
          ":hover": {
            backgroundColor: 'rgba(0,0,0,0.05)',
            transition: 'all 0.3s ease-in-out'
          }
        }
      }
    },


    MuiCard: {
      defaultProps: {
        elevation: 0
      },
      styleOverrides: {
        root: {
          boxShadow: '0px 5px 5px rgba(0,0,0,0.05)',
          borderRadius: '10px',
        }
      }
    }

  }
});