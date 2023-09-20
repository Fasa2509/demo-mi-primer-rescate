import { FC, useContext } from "react";
import { useRouter } from "next/router";
import NextLink from 'next/link';
import { Box, Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";
import Pets from '@mui/icons-material/Pets';
import AddAlert from '@mui/icons-material/AddAlert';
import VolunteerActivism from '@mui/icons-material/VolunteerActivism';
import TrendingUp from '@mui/icons-material/TrendingUp';
import ShoppingBag from '@mui/icons-material/ShoppingBag';
import AdminPanelSettings from '@mui/icons-material/AdminPanelSettings';
import Category from '@mui/icons-material/Category';
import ConfirmationNumber from '@mui/icons-material/ConfirmationNumber';
import LoginOutlined from '@mui/icons-material/LoginOutlined';
import VpnKey from '@mui/icons-material/VpnKey';
import Home from '@mui/icons-material/Home';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LocalCafe from '@mui/icons-material/LocalCafe';
import EmojiNature from '@mui/icons-material/EmojiNature';
import { useSnackbar } from "notistack";

import { AuthContext, MenuContext } from "../../context";
import { ConfirmNotificationButtons, PromiseConfirmHelper } from "../../utils";
import { SideMenuButton } from "./SideMenuButton";

export const SideMenu: FC = () => {

    const router = useRouter();
    const { isMenuOpen, toggleSideMenu } = useContext(MenuContext);
    const { isLoggedIn, logoutUser, user } = useContext(AuthContext);
    const { enqueueSnackbar } = useSnackbar();

    const logOut = async () => {
        let key = enqueueSnackbar('¿Quieres cerrar sesión?', {
            variant: 'info',
            autoHideDuration: 10000,
            action: ConfirmNotificationButtons,
        })

        const confirm = await PromiseConfirmHelper(key, 10000);

        if (!confirm) return;

        toggleSideMenu();
        logoutUser();
        return;
    }

    return (
        <Drawer
            open={isMenuOpen}
            anchor='right'
            sx={{ display: { xs: 'flex', md: 'none' }, backdropFilter: 'blur(2px)', transition: 'all 750ms ease-out' }}
            onClose={toggleSideMenu}
        >
            <Box sx={{ width: { xs: 200, sm: 250, md: 300 }, paddingTop: '72px', position: 'relative' }}>

                <div style={{
                    width: '100%',
                    height: '80px',
                    backgroundColor: '#2AD8A4',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                }}></div>

                <List>

                    <NextLink href='/' scroll={false} passHref>
                        <a onClick={toggleSideMenu}>
                            <ListItemButton sx={{ backgroundColor: router.asPath === '/' ? '#eee' : '#fff' }}>
                                <ListItemIcon>
                                    <Home color='secondary' />
                                </ListItemIcon>
                                <ListItemText primary={'Inicio'} />
                            </ListItemButton>
                        </a>
                    </NextLink>

                    <NextLink href='/miprimerrescate' scroll={false} passHref>
                        <a onClick={toggleSideMenu}>
                            <ListItemButton sx={{ backgroundColor: router.asPath.startsWith('/miprimerrescate') ? '#eee' : '#fff' }}>
                                <ListItemIcon>
                                    <Pets color='secondary' />
                                </ListItemIcon>
                                <ListItemText primary={'Nosotros'} />
                            </ListItemButton>
                        </a>
                    </NextLink>

                    <NextLink href='/apoyo' scroll={false} passHref>
                        <a onClick={toggleSideMenu}>
                            <ListItemButton sx={{ backgroundColor: router.asPath.startsWith('/apoyo') ? '#eee' : '#fff' }}>
                                <ListItemIcon>
                                    <AddAlert color='secondary' />
                                </ListItemIcon>
                                <ListItemText primary={'Apoyo'} />
                            </ListItemButton>
                        </a>
                    </NextLink>

                    <SideMenuButton active={router.asPath.startsWith('/adoptar')} text='Adoptar' links={[{ path: '/adoptar/perros', text: 'Perros' }, { path: '/adoptar/gatos', text: 'Gatos' }, { path: '/adoptar/otros', text: 'Otros' }, { path: '/adoptar/formulario', text: 'Formulario' }]}>
                        <VolunteerActivism color='secondary' />
                    </SideMenuButton>

                    <NextLink href='/cambios' scroll={false} passHref>
                        <a onClick={toggleSideMenu}>
                            <ListItemButton sx={{ backgroundColor: router.asPath.startsWith('/cambios') ? '#eee' : '#fff' }}>
                                <ListItemIcon>
                                    <AddAlert color='secondary' />
                                </ListItemIcon>
                                <ListItemText primary={'Cambios'} />
                            </ListItemButton>
                        </a>
                    </NextLink>

                    <NextLink href='/tienda'>
                        <a onClick={toggleSideMenu}>
                            <ListItemButton sx={{ backgroundColor: router.asPath.startsWith('/tienda') ? '#eee' : '#fff' }}>
                                <ListItemIcon>
                                    <ShoppingBag color='secondary' />
                                </ListItemIcon>
                                <ListItemText primary={'Tienda'} />
                            </ListItemButton>
                        </a>
                    </NextLink>

                    {/* Admin */}

                    {isLoggedIn && user && (user.role === 'admin' || user.role === 'superuser') && (
                        <>
                            <Divider />
                            <ListSubheader>Admin Panel</ListSubheader>

                            <NextLink href='/admin/usuarios'>
                                <a onClick={toggleSideMenu}>
                                    <ListItemButton sx={{ backgroundColor: router.asPath.startsWith('/admin/usuarios') ? '#eee' : '#fff' }}>
                                        <ListItemIcon>
                                            <AdminPanelSettings color='secondary' />
                                        </ListItemIcon>
                                        <ListItemText primary={'Usuarios'} />
                                    </ListItemButton>
                                </a>
                            </NextLink>

                            <NextLink href='/admin/ordenes'>
                                <a onClick={toggleSideMenu}>
                                    <ListItemButton sx={{ backgroundColor: router.asPath.startsWith('/admin/ordenes') ? '#eee' : '#fff' }}>
                                        <ListItemIcon>
                                            <ConfirmationNumber color='secondary' />
                                        </ListItemIcon>
                                        <ListItemText primary={'Órdenes'} />
                                    </ListItemButton>
                                </a>
                            </NextLink>

                            <NextLink href='/admin/productos'>
                                <a onClick={toggleSideMenu}>
                                    <ListItemButton sx={{ backgroundColor: router.asPath.startsWith('/admin/productos') ? '#eee' : '#fff' }}>
                                        <ListItemIcon>
                                            <Category color='secondary' />
                                        </ListItemIcon>
                                        <ListItemText primary={'Productos'} />
                                    </ListItemButton>
                                </a>
                            </NextLink>

                            <NextLink href='/admin/adopciones'>
                                <a onClick={toggleSideMenu}>
                                    <ListItemButton sx={{ backgroundColor: router.asPath.startsWith('/admin/adopciones') ? '#eee' : '#fff' }}>
                                        <ListItemIcon>
                                            <LocalCafe color='secondary' />
                                        </ListItemIcon>
                                        <ListItemText primary={'Adopciones'} />
                                    </ListItemButton>
                                </a>
                            </NextLink>

                            <NextLink href='/admin/mascotas'>
                                <a onClick={toggleSideMenu}>
                                    <ListItemButton sx={{ backgroundColor: router.asPath.startsWith('/admin/mascotas') ? '#eee' : '#fff' }}>
                                        <ListItemIcon>
                                            <EmojiNature color='secondary' />
                                        </ListItemIcon>
                                        <ListItemText primary={'Mascotas'} />
                                    </ListItemButton>
                                </a>
                            </NextLink>
                        </>
                    )}


                    <Divider />

                    {isLoggedIn ? (
                        <>
                            <Divider />
                            <ListSubheader>Mi Cuenta</ListSubheader>

                            <NextLink href='/personal'>
                                <a rel='nofollow' onClick={toggleSideMenu}>
                                    <ListItemButton sx={{ backgroundColor: router.asPath.startsWith('/personal') ? '#eee' : '#fff' }}>
                                        <ListItemIcon>
                                            <AccountCircle color='secondary' />
                                        </ListItemIcon>
                                        <ListItemText primary={'Mi Información'} />
                                    </ListItemButton>
                                </a>
                            </NextLink>

                            <ListItemButton onClick={logOut}>
                                <ListItemIcon>
                                    <LoginOutlined color='secondary' />
                                </ListItemIcon>
                                <ListItemText primary={'Cerrar sesión'} />
                            </ListItemButton>
                        </>
                    ) : (
                        <NextLink href={'/auth?p=' + router.asPath}>
                            <a onClick={toggleSideMenu}>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <VpnKey color='secondary' />
                                    </ListItemIcon>
                                    <ListItemText primary={'Entrar'} />
                                </ListItemButton>
                            </a>
                        </NextLink>
                    )

                    }

                </List>
            </Box>
        </Drawer>
    )
}