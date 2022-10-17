import { SnackbarKey } from "notistack";

export const PromiseConfirmHelper = ( key: SnackbarKey, duration: number ): Promise<boolean> => {
    
    return new Promise(( resolve, reject ) => {
        // let key = enqueueSnackbar('Tu sesión está a punto de expirar, ¿quieres extenderla?', {
        //     variant: 'info',
        //     autoHideDuration: duration,
        //     action: ConfirmNotificationButtons,
        // })

        let timer = setTimeout(() => reject(callback), duration);

        const callback = ( e: any ) => {
            if ( e.target.matches(`.accept.n${ key.toString().replace('.', '') } *`) ) {
                resolve({
                    accepted: true,
                    callback,
                    timer,
                })
            }

            if ( e.target.matches(`.deny.n${ key.toString().replace('.', '') } *`) ) {
                resolve({
                    accepted: false,
                    callback,
                    timer,
                })
            }
        }

        document.addEventListener('click', callback);
    })
    // @ts-ignore
    .then(({ accepted, callback, timer }: { accepted: boolean, callback: any, timer: any }) => {
        document.removeEventListener('click', callback);
        clearTimeout( timer );

        return accepted;
    })
    .catch(({ callback }: { callback: any }) => {
        document.removeEventListener('click', callback);
        return false;
    })

}