import axios from 'axios';

import { mprApi } from '../mprApi'
import { db } from ".";
import { Pet } from "../models";
import { IPet, PetType } from "../interfaces";


export const getAllPets = async (): Promise<IPet[] | null> => {

    try {
        await db.connect();

        const pets: IPet[] = await Pet.find().sort({ createdAt: -1 }).limit( 100 );

        await db.disconnect();

        return JSON.parse( JSON.stringify( pets ) );
    } catch( error ) {
        console.log( error );
        return null;
    }

}


export const createNewPet = async ({ type, name, images, description }: { type: PetType, name: string, images: string[], description: string }): Promise<{ error: boolean; message: string; }> => {
    
    try {
        const { data } = await mprApi.post<{ error: boolean; message: string; }>('/pet', {
            type,
            name,
            images,
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
        
        const pets = await Pet.find({ type: petType, isAble: true, isAdminPet: true }).sort({ createdAt: -1 }).limit( 6 );
        
        await db.disconnect();

        return JSON.parse( JSON.stringify( pets ) );
    } catch( error ) {
        console.log( error );
        await db.disconnect();
        return null;
    }

}

export const getChangedPets = async (): Promise<IPet[] | null> => {

    try {
        await db.connect();
        
        const pets = await Pet
            .find({ type: 'cambios', isAble: true, isAdminPet: false })
            .sort({ createdAt: -1 })
            .limit( 6 );
        
        await db.disconnect();

        return JSON.parse( JSON.stringify( pets ) );
    } catch( error ) {
        console.log( error );
        await db.disconnect();
        return null;
    }

}

export const getMorePets = async ( date: number, type: string, isAdmin: boolean ): Promise<IPet[] | null> => {

    if ( !date || isNaN( Number(date) ) || Number( date ) < 1662023660970 || typeof isAdmin !== 'boolean' ) return [];

    try {
        const { data } = await mprApi.get(`/pet?date=${ date }&type=${ type }&admin=${ isAdmin }`);

        return data;
    } catch( error ) {
        console.log( error );
        await db.disconnect();
        return null;
    }

}

export const udpatePet = async ( petId: string, petDescription: string ): Promise<{ error: boolean; message: string; }> => {
    
    try {
        const { data } = await mprApi.put('/pet', {
            petId,
            petDescription,
        });

        return data;
    } catch( error ) {
        console.log( error );

        // @ts-ignore
        if ( axios.isAxiosError( error ) ) return error.response ? error.response.data : { error: true, message: 'Ocurrió un error' };
    
        return {
            error: true,
            message: 'Ocurrió un error eliminando la mascota'
        }
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
            message: 'Ocurrió un error eliminando la mascota'
        }
    }

}