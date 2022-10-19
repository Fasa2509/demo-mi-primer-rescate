import axios from "axios";
import { db } from ".";
import { mprApi } from "../mprApi";
import { IAdoption } from "../interfaces";
import { Adoption } from "../models";

export const createAdoption = async ( form: IAdoption ): Promise<{ error: boolean; message: string; }> => {

    if ( !form.user ) return { error: true, message: 'Es necesario haber iniciado sesión' };

    const { _id, ...actualForm } = form;

    try {
        const { data } = await mprApi.post('/adoption', actualForm);

        return data;
    } catch( error: any ) {
        console.log( error );

        if ( axios.isAxiosError( error ) ) {
            return {
                error: true,
                // @ts-ignore
                message: error.response ? error.response.data.message : 'Ocurrió un error guardando la adopción',
            }
        }

        return {
            error: true,
            message: 'Error',
        };
    }

}

export const getAllAdoptions = async () => {

    try {
        await db.connect();
        
        const adoptions = await Adoption.find();
        
        await db.disconnect();
        
        return JSON.parse( JSON.stringify( adoptions ) );
    } catch( error: any ) {
        console.log( error );
        await db.disconnect();
        return null;
    }

}