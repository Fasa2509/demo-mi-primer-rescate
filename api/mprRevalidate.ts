import { mprApi } from ".";

export const mprRevalidatePage = async ( pageToRevalidate: string ): Promise<{ error: boolean; message: string; }> => {
    
    if ( !pageToRevalidate ) return {
            error: true,
            message: 'Falta slug a revalidar'
        };

    try {
        await mprApi.get(`/revalidate?p=${ pageToRevalidate }&secret=${ process.env.NEXT_PUBLIC_SECRET_REVALIDATE }`);
        
        return {
            error: false,
            message: 'Revalidation successfully'
        }
    } catch( error ) {
        console.log( error );
        return {
            error: true,
            message: 'Error revalidating page'
        }
    }

}