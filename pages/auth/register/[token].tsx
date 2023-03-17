import { GetServerSideProps, NextPage } from "next";
import NextLink from 'next/link';
import { getServerSession } from "next-auth";
import { Box, Link } from "@mui/material";
import { Check, Home } from "@mui/icons-material";
import { nextAuthOptions } from "../../api/auth/[...nextauth]";

import { db } from "../../../database";
import { User } from "../../../models";
import { MainLayout } from "../../../components";
import { jwt } from "../../../utils";
import styles from '../../../styles/Auth.module.css';

interface Props {
    userEmail: string;
}

const TokenPage: NextPage<Props> = ({ userEmail }) => {

    return (
        <MainLayout title='Activar cuenta' H1='Inicio' pageDescription='Activa tu cuenta de MPR para tener acceso a todas las funcionalidades de nuestra página' pageImage={ 'Logo-MPR.png' } titleIcon={ <Home color='info' sx={{ fontSize: '1.5rem' }} /> } nextPage='/auth' url='/auth'>
            
            <Box className={ styles.info__container }>
                <p className={ styles.title }>Activar Cuenta MPR</p>
                <Box className={ styles.check__container }>
                    <Check sx={{ fontSize: '3.5rem', color: '#fff' }} />
                </Box>
                <p>¡Listo, tu cuenta fue activada!</p>
                <p>Ahora podrás iniciar sesión con tu correo { userEmail }</p>
                <p>Gracias por ingresar en nuestra fundación</p>
                <NextLink href='/auth' passHref><Link color='secondary'>Iniciar sesión</Link></NextLink>
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

    const session = await getServerSession( ctx.req, ctx.res, nextAuthOptions );
  
    if ( session ) {
      return {
        redirect: {
            destination: '/',
            permanent: false,
        }
      }
    }

    await db.connect();
    
    const user = await User.findById( decodedToken._id );

    if ( !user ) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    user.isAble = true;
    await user.save();
    
    await db.disconnect();

    return {
        props: {
            userEmail: user.email,
        },
    }
}

export default TokenPage;