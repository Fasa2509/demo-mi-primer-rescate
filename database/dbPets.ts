import { db } from ".";
import { Pet } from "../models";
import { IPet, PetType } from "../interfaces";

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