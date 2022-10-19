import { FC, useContext } from "react"
import NextLink from 'next/link'
import { useRouter } from "next/router"

import { Box, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from "@mui/material"
import { Pets, AddAlert, VolunteerActivism, TrendingUp,  ShoppingBag, AdminPanelSettings, Category, ConfirmationNumber, LoginOutlined, VpnKey, Home, AccountCircle, FilterFrames, LocalCafe } from "@mui/icons-material"
import { useSnackbar } from "notistack"

import { AuthContext, MenuContext } from "../../context"
import { ConfirmNotificationButtons, PromiseConfirmHelper } from "../../utils"

export const SideMenu: FC = () => {

    const router = useRouter();
    const { isMenuOpen, toggleSideMenu } = useContext( MenuContext );
    const { isLoggedIn, logoutUser, user } = useContext( AuthContext );
    const { enqueueSnackbar } = useSnackbar();

    const logOut = async () => {
        let key = enqueueSnackbar('¿Quieres cerrar sesión?', {
            variant: 'info',
            autoHideDuration: 10000,
            action: ConfirmNotificationButtons,
        })

        const confirm = await PromiseConfirmHelper( key, 10000 );
      
        if ( !confirm ) return;

        toggleSideMenu();
        logoutUser();

        return;
    }

  return (
    <Drawer
        open={ isMenuOpen }
        anchor='right'
        sx={{ display: { xs: 'flex', md: 'none' }, backdropFilter: 'blur(2px)', transition: 'all 0.5s ease-out' }}
        onClose={ toggleSideMenu }
    >
        <Box sx={{ width: { xs: 200, sm: 250, md: 300 }, paddingTop: '72px', position: 'relative' }}>

            {/* <div style={{
                width: '100%',
                height: '45px',
                backgroundColor: '#2AD8A4',
                position: 'absolute',
                top: 0,
                left: 0,
            }}></div> */}

            <List>

                {
                    isLoggedIn
                        ? (
                            <ListItem button onClick={ logOut }>
                                <ListItemIcon>
                                    <LoginOutlined color='secondary' />
                                </ListItemIcon>
                                <ListItemText primary={'Cerrar sesión'} />
                            </ListItem>
                        ) : (
                            <NextLink href={ '/auth' }>
                                <a onClick={ toggleSideMenu }>
                                    <ListItem button>
                                        <ListItemIcon>
                                            <VpnKey color='secondary' />
                                        </ListItemIcon>
                                        <ListItemText primary={'Ingresar'} />
                                    </ListItem>
                                </a>
                            </NextLink>
                        )
                }

                <Divider />

                <NextLink href={ '/' } scroll={ false }>
                    <a onClick={ toggleSideMenu }>
                        <ListItem button sx={{ backgroundColor: router.asPath === '/' ? '#eaeaea' : '' }}>
                            <ListItemIcon>
                                <Home color='secondary' />
                            </ListItemIcon>
                            <ListItemText primary={'Inicio'} />
                        </ListItem>
                    </a>
                </NextLink>

                <NextLink href={ '/miprimerrescate' }>
                    <a onClick={ toggleSideMenu }>
                        <ListItem button sx={{ backgroundColor: router.asPath === '/miprimerrescate' ? '#eaeaea' : '' }}>
                            <ListItemIcon>
                                <Pets color='secondary' />
                            </ListItemIcon>
                            <ListItemText primary={'Proyecto MPR'} />
                        </ListItem>
                    </a>
                </NextLink>

                <NextLink href={ '/apoyo' }>
                    <a onClick={ toggleSideMenu }>
                        <ListItem button sx={{ backgroundColor: router.asPath === '/apoyo' ? '#eaeaea' : '' }}>
                            <ListItemIcon>
                                <AddAlert color='secondary' />
                            </ListItemIcon>
                            <ListItemText primary={'Apoyo'} />
                        </ListItem>
                    </a>
                </NextLink>

                <NextLink href={ '/adoptar' }>
                    <a onClick={ toggleSideMenu }>
                        <ListItem button  sx={{ backgroundColor: router.asPath === '/adoptar' ? '#eaeaea' : '' }}>
                            <ListItemIcon>
                                <VolunteerActivism color='secondary' />
                            </ListItemIcon>
                            <ListItemText primary={'Adoptar'} />
                        </ListItem>
                    </a>
                </NextLink>

                <NextLink href={ '/cambios' }>
                    <a onClick={ toggleSideMenu }>
                        <ListItem button sx={{ backgroundColor: router.asPath === '/cambios' ? '#eaeaea' : '' }}>
                            <ListItemIcon>
                                <TrendingUp color='secondary' />
                            </ListItemIcon>
                            <ListItemText primary={'Cambios'} />
                        </ListItem>
                    </a>
                </NextLink>

                <NextLink href={ '/tienda' }>
                    <a onClick={ toggleSideMenu }>
                        <ListItem button  sx={{ backgroundColor: router.asPath === '/tienda' ? '#eaeaea' : '' }}>
                            <ListItemIcon>
                                <ShoppingBag color='secondary' />
                            </ListItemIcon>
                            <ListItemText primary={'Tienda'} />
                        </ListItem>
                    </a>
                </NextLink>

                {/* Admin */}
                
                { isLoggedIn && user && ( user.role === 'admin' || user.role === 'superuser' ) && (
                    <>
                    <Divider />
                    <ListSubheader>Admin Panel</ListSubheader>

                    <NextLink href={ '/admin/productos' }>
                        <a onClick={ toggleSideMenu }>
                            <ListItem button>
                                <ListItemIcon>
                                    <Category color='secondary' />
                                </ListItemIcon>
                                <ListItemText primary={'Productos'} />
                            </ListItem>
                        </a>
                    </NextLink>

                    <NextLink href={ '/admin/ordenes' }>
                        <a onClick={ toggleSideMenu }>
                            <ListItem button>
                                <ListItemIcon>
                                    <ConfirmationNumber color='secondary' />
                                </ListItemIcon>
                                <ListItemText primary={'Órdenes'} />
                            </ListItem>
                        </a>
                    </NextLink>
                    
                    <NextLink href={ '/admin/usuarios' }>
                        <a onClick={ toggleSideMenu }>
                            <ListItem button>
                                <ListItemIcon>
                                    <AdminPanelSettings color='secondary' />
                                </ListItemIcon>
                                <ListItemText primary={'Usuarios'} />
                            </ListItem>
                        </a>
                    </NextLink>
                    
                    <NextLink href={ '/admin/adopciones' }>
                        <a onClick={ toggleSideMenu }>
                            <ListItem button>
                                <ListItemIcon>
                                    <LocalCafe color='secondary' />
                                </ListItemIcon>
                                <ListItemText primary={'Adopciones'} />
                            </ListItem>
                        </a>
                    </NextLink>
                    </>
                )}

                { isLoggedIn && (
                    <>
                    <Divider />
                    <ListSubheader>Mi Cuenta</ListSubheader>

                    <NextLink href={ '/personal' } scroll={ false }>
                        <a onClick={ toggleSideMenu }>
                            <ListItem button>
                                <ListItemIcon>
                                    <AccountCircle color='secondary' />
                                </ListItemIcon>
                                <ListItemText primary={'Mi Información'} />
                            </ListItem>
                        </a>
                    </NextLink>

                    {/* <NextLink href={ '/' } scroll={ false }>
                        <a onClick={ toggleSideMenu }>
                            <ListItem button>
                                <ListItemIcon>
                                    <FilterFrames color='secondary' />
                                </ListItemIcon>
                                <ListItemText primary={'Mis Órdenes'} />
                            </ListItem>
                        </a>
                    </NextLink>

                    <NextLink href={ '/' } scroll={ false }>
                        <a onClick={ toggleSideMenu }>
                            <ListItem button>
                                <ListItemIcon>
                                    <Pets color='secondary' />
                                </ListItemIcon>
                                <ListItemText primary={'Adopciones'} />
                            </ListItem>
                        </a>
                    </NextLink> */}
                    </>
                )}
                        
            </List>
        </Box>
    </Drawer>
  )
}