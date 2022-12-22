import { FC } from 'react';
import { useSnackbar } from 'notistack';
import { Check, Close } from '@mui/icons-material';

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
            <button className={ `notification__buttons accept n${ snackbarKey.toString().replace('.', '') }` } onClick={ () => closeSnackbar( snackbarKey ) }><Check color='success' /></button>
            <button className={ `notification__buttons deny n${ snackbarKey.toString().replace('.', '') }` } onClick={ () => closeSnackbar( snackbarKey ) }><Close color='error' /></button>
        </>
    )
}