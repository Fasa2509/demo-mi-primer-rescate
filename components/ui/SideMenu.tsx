import { FC, useContext } from "react"
import NextLink from 'next/link'

import { Box, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from "@mui/material"
import { Pets, AddAlertOutlined, VolunteerActivismOutlined, TrendingUp,  ShoppingBagOutlined, AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined, LoginOutlined, VpnKeyOutlined, Home } from "@mui/icons-material"

import { useRouter } from "next/router"
import { AuthContext, MenuContext } from "../../context"

export const SideMenu: FC = () => {

    const router = useRouter()
    const { isMenuOpen, toggleSideMenu } = useContext( MenuContext );
    const { isLoggedIn, logIn, logOut } = useContext( AuthContext );

  return (
    <Drawer
        open={ isMenuOpen }
        anchor='right'
        sx={{ backdropFilter: 'blur(2px)', transition: 'all 0.5s ease-out' }}
        onClose={ toggleSideMenu }
    >
        <Box sx={{ width: { xs: 200, sm: 250, md: 300 }, paddingTop: 5, position: 'relative' }}>

            <div style={{
                width: '100%',
                height: '45px',
                backgroundColor: '#2AD8A4',
                position: 'absolute',
                top: 0,
                left: 0,
            }}></div>

            <List>

                {
                    isLoggedIn
                        ? (
                            <ListItem button onClick={ () => logOut() }>
                                <ListItemIcon>
                                    <LoginOutlined color='secondary' />
                                </ListItemIcon>
                                <ListItemText primary={'Salir'} />
                            </ListItem>
                        ) : (
                            <ListItem button onClick={ () => logIn() }>
                                <ListItemIcon>
                                    <VpnKeyOutlined color='secondary' />
                                </ListItemIcon>
                                <ListItemText primary={'Ingresar'} />
                            </ListItem>
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
                                <AddAlertOutlined color='secondary' />
                            </ListItemIcon>
                            <ListItemText primary={'Apoyo'} />
                        </ListItem>
                    </a>
                </NextLink>

                <NextLink href={ '/adoptar' }>
                    <a onClick={ toggleSideMenu }>
                        <ListItem button  sx={{ backgroundColor: router.asPath === '/adoptar' ? '#eaeaea' : '' }}>
                            <ListItemIcon>
                                <VolunteerActivismOutlined color='secondary' />
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
                                <ShoppingBagOutlined color='secondary' />
                            </ListItemIcon>
                            <ListItemText primary={'Tienda'} />
                        </ListItem>
                    </a>
                </NextLink>

                {/* Admin */}
                
                { isLoggedIn && (
                    <>
                    <Divider />
                    <ListSubheader>Admin Panel</ListSubheader>
                    
                    <ListItem button>
                        <ListItemIcon>
                            <CategoryOutlined color='secondary' />
                        </ListItemIcon>
                        <ListItemText primary={'Productos'} />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <ConfirmationNumberOutlined color='secondary' />
                        </ListItemIcon>
                        <ListItemText primary={'Ordenes'} />
                    </ListItem>
                    
                    <ListItem button>
                        <ListItemIcon>
                            <AdminPanelSettings color='secondary' />
                        </ListItemIcon>
                        <ListItemText primary={'Usuarios'} />
                    </ListItem>
                    </>
                )}
                        
            </List>
        </Box>
    </Drawer>
  )
}