import { FC, useContext } from 'react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { Check, Close } from '@mui/icons-material';
import { MenuContext } from "../context"

export const CloseNotificationButton: FC = ( snackbarKey: any ) => {
    
    const { closeSnackbar } = useSnackbar();

    return (
        <button className='notification__buttons transparent' onClick={ () => {
            closeSnackbar( snackbarKey )
        }}><Close color='info' /></button>
    )
}

export const ConfirmNotificationButtons: FC = ( snackbarKey: any ) => {

    const { closeSnackbar } = useSnackbar();

    return (
        <>
            <button className={ `notification__buttons accept n${ snackbarKey.toString().replace('.', '') }` } onClick={ () => {
                closeSnackbar( snackbarKey )
            }}><Check color='success' /></button>
            <button className={ `notification__buttons deny n${ snackbarKey.toString().replace('.', '') }` } onClick={ () => {
                closeSnackbar( snackbarKey )
            }}><Close color='error' /></button>
        </>
    )
}

export const ConfirmCloseSession: FC = ( snackbarKey: any ) => {
    
    const router = useRouter();
    // const { isLoggedIn, logIn, logOut } = useContext( AuthContext );
    const { closeSnackbar } = useSnackbar();

    return (
        <>
            <button className='notification__buttons' onClick={ () => {
                // logOut();
                router.reload();
            }}><Check color='success' /></button>
            <button className='notification__buttons' onClick={ () => {
                closeSnackbar( snackbarKey )
            }}><Close color='error' /></button>
        </>
    )
}