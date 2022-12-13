import axios from "axios";
import { mprApi } from ".";

export const mprRevalidatePage = async ( pageToRevalidate: string ): Promise<{ error: boolean; message: string; }> => {
    
    if ( !pageToRevalidate )
        return {
            error: true,
            message: 'Falta slug a revalidar'
        };

    try {
        const { data } = await mprApi.post('/revalidate', { p: pageToRevalidate, secret: process.env.NEXT_PUBLIC_SECRET_REVALIDATE });
        
        return data;
    } catch( error ) {

        if ( axios.isAxiosError( error ) ) {
            console.log( error.response!.data );
            return {
                error: true,
                // @ts-ignore
                message: error.response ? error.response.data.message || 'Error revalidando ' + pageToRevalidate : 'Error revalidando la página ' + pageToRevalidate,
            }
        }

        console.log( error );

        return {
            error: true,
            message: 'Error revalidando la página ' + pageToRevalidate,
        };
    }

}