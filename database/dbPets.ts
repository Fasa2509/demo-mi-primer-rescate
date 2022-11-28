import axios from 'axios';

import { mprApi } from '../mprApi'
import { db } from ".";
import { Pet } from "../models";
import { IPet, PetType } from "../interfaces";

export const createNewPet = async ({ userId, type, name, images, description }: { userId: string, type: PetType, name: string, images: string, description: string }): Promise<{ error: boolean; message: string; }> => {
    
    try {
        const { data } = await mprApi.post<{ error: boolean; message: string; }>('/pet', {
            userId,
            type,
            name,
            images: [images.startsWith('/') ? images : `/${ images }` ],
            description,
        });

        // @ts-ignore
        return data;
    } catch( error ) {
        console.log( error );

        // @ts-ignore
        if ( axios.isAxiosError( error ) ) return error.response ? error.response.data : { error: true, message: 'Ocurrió un error' };

        return {
            error: true,
            message: 'Ocurrió un error creando la nueva mascota'
        }
    }

}

export const getAllTypePets = async ( petType: PetType ): Promise<IPet[] | null> => {

    try {
        await db.connect();
        
        const pets = await Pet.find({ type: petType, isAble: true });
        
        await db.disconnect();

        return JSON.parse( JSON.stringify( pets ) );
    } catch( error ) {
        console.log( error );
        await db.disconnect();
        return null;
    }

}

export const deletePet = async ( petId: string ): Promise<{ error: boolean; message: string; }> => {

    try {
        let { data } = await mprApi.delete(`/pet?id=${ petId }`);

        return data;
    } catch( error ) {
        console.log( error );

        // @ts-ignore
        if ( axios.isAxiosError( error ) ) return error.response ? error.response.data : { error: true, message: 'Ocurrió un error' };
    
        return {
            error: true,
            message: 'Ocurrió un error creando la mascota'
        }
    }

}