import { useContext, useState } from "react";
import { GetServerSideProps, NextPage } from "next"
import NextLink from 'next/link';
import { unstable_getServerSession } from "next-auth";
import { Box, Button, Link, TextField } from "@mui/material";
import { Check, Home } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { nextAuthOptions } from "../../api/auth/[...nextauth]";

import { dbUsers } from "../../../database";
import { ScrollContext } from "../../../context";
import { MainLayout } from "../../../components";
import { jwt, validations } from "../../../utils";
import styles from '../../../styles/Auth.module.css';

interface Props {
    userInfo: {
        _id: string;
        email: string;
    }
}

const TokenPage: NextPage<Props> = ({ userInfo }) => {

    const { setIsLoading } = useContext( ScrollContext );
    const { enqueueSnackbar } = useSnackbar();
    const [passwords, setPasswords] = useState({ password1: '', password2: '' });
    const [resolved, setResolved] = useState( false );

    const handleChangePassword = async () => {
        if ( !validations.isValidPassword( passwords.password1 ) || !validations.isValidPassword( passwords.password2 ) )
            return enqueueSnackbar('La contraseña no cumple con los requisitos', { variant: 'warning' });
        
        if ( passwords.password1 !== passwords.password2 )
            return enqueueSnackbar('Las contraseñas deben ser iguales', { variant: 'warning' });
    
        setIsLoading( true );

        const res = await dbUsers.updateUserPassword( userInfo._id, passwords.password1 );

        res.error || setResolved( true );

        setIsLoading( false );
        
        enqueueSnackbar(res.message, { variant: !res.error ? 'success' : 'error' });
    }

    return (
        <MainLayout title='Recuperar contraseña' H1='Inicio' pageDescription='Cambiar contraseña de tu cuenta de MPR' pageImage={ 'Logo-MPR.png' } titleIcon={ <Home color='info' sx={{ fontSize: '1.5rem' }} /> } nextPage='/auth' url='/auth'>
            
            <Box className={ styles.info__container }>
                <p className={ styles.title }>Recuperar Contraseña</p>

                <p>Cambia la contraseña de tu cuenta de MPR.</p>

                <p>Esta debe tener al menos 8 caracteres, mayúculas, minúsculas, un número y un caracter especial.</p>

                {
                    resolved ||
                    <>
                    <TextField
                        label='Contraseña'
                        type='password'
                        variant='filled'
                        color='secondary'
                        fullWidth
                        value={ passwords.password1 }
                        onChange={ ({ target }) => setPasswords({ ...passwords, password1: target.value })}
                    />

                    <TextField
                        label='Repite tu contraseña'
                        type='password'
                        variant='filled'
                        color='secondary'
                        fullWidth
                        value={ passwords.password2 }
                        onChange={ ({ target }) => setPasswords({ ...passwords, password2: target.value })}
                    />

                    <Button color='secondary' sx={{ fontSize: '.9rem', alignSelf: 'center', borderRadius: '5rem', padding: '.3rem 1.5rem' }} onClick={ handleChangePassword }>Cambiar contraseña</Button>
                    </>
                }

                { resolved && 
                <>
                    <Box className={ `${ styles.check__container } fadeIn` }>
                        <Check sx={{ fontSize: '3.5rem', color: '#fff' }} />
                    </Box>
                    <NextLink href='/auth' passHref><Link className='fadeIn' color='secondary'>Iniciar sesión</Link></NextLink>
                </>
                }
            </Box>
            
        </MainLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ( ctx ) => {

    const session = await unstable_getServerSession( ctx.req, ctx.res, nextAuthOptions );
  
    if ( session ) {
      return {
        redirect: {
            destination: '/',
            permanent: false,
        }
      }
    }

    const { token = '' } = ctx.query;
    
    const decodedToken = await jwt.isValidEmailToken( token.toString().replaceAll('___', '.') );

    if ( !decodedToken ) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    return {
        props: {
            userInfo: decodedToken,
        }
    }
  }

export default TokenPage;