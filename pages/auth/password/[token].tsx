import { useContext, useState } from "react";
import { GetServerSideProps, NextPage } from "next"
import NextLink from 'next/link';
import { unstable_getServerSession } from "next-auth";
import { Box, Button, Link, TextField } from "@mui/material";
import { Check, Home } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { nextAuthOptions } from "../../api/auth/[...nextauth]";

import { ScrollContext } from "../../../context";
import { MainLayout } from "../../../components";
import { jwt, validations } from "../../../utils";
import styles from '../../../styles/Auth.module.css';
import { dbUsers } from "../../../database";

interface Props {
    userInfo: {
        _id: string;
        email: string;
    }
}

const TokenPage: NextPage<Props> = ({ userInfo }) => {

    const { setIsLoading } = useContext( ScrollContext );
    const [password, setPassword] = useState('');
    const { enqueueSnackbar } = useSnackbar();

    const handleChangePassword = async () => {
        // if ( !validations.isValidPassword( password ) )
        //     return enqueueSnackbar('La contraseña no cumple con los requisitos', { variant: 'warning' });
    
        setIsLoading( true );

        const res = await dbUsers.updateUserPassword( userInfo._id, password );

        setIsLoading( false );
        
        enqueueSnackbar(res.message, { variant: !res.error ? 'success' : 'error' });
    }

    return (
        <MainLayout title='Recuperar contraseña' H1='Inicio' pageDescription='Cambiar contraseña de tu cuenta de MPR' pageImage={ 'Logo-MPR.png' } titleIcon={ <Home color='info' sx={{ fontSize: '1.5rem' }} /> } nextPage='/auth'>
            
            <Box className={ styles.info__container }>
                <p className={ styles.title }>Actualizar Contraseña</p>
                {/* <Box className={ styles.check__container }>
                    <Check sx={{ fontSize: '3.5rem', color: '#fff' }} />
                </Box> */}

                <p>Cambia la contraseña de tu cuenta de MPR.</p>

                <TextField
                    label='Contraseña'
                    type='password'
                    variant='filled'
                    color='secondary'
                    fullWidth
                    error={ false }
                    helperText={ '' }
                    onChange={ ({ target }) => setPassword( target.value )}
                />

                <Button color='secondary' sx={{ fontSize: '.9rem', alignSelf: 'center', borderRadius: '5rem', padding: '.3rem 1.5rem' }} onClick={ handleChangePassword }>Actualizar clave</Button>

                {/* <NextLink href='/auth' passHref><Link color='secondary'>Iniciar sesión</Link></NextLink> */}
            </Box>
            
        </MainLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ( ctx ) => {

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

    const session = await unstable_getServerSession( ctx.req, ctx.res, nextAuthOptions );
  
    if ( session ) {
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