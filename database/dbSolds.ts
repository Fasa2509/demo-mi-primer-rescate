import { db } from ".";
import { Sold } from "../models";
import { ISold } from "../interfaces";

export const getSoldProducts = async (): Promise<ISold[] | null> => {

    try {
        await db.connect();

        const solds = await Sold.find();

        await db.disconnect();

        return JSON.parse( JSON.stringify( solds ) );
    } catch( error ) {
        console.log( error );
        return null;
    }

}

export const updateSoldProducts = async ( updatedProducts: ISold[] ): Promise< boolean > => {

    try {
        await db.connect();
        
        await Sold.deleteMany();

        // @ts-ignore
        await Sold.insertMany( updatedProducts.map(( p ) => ({ productId: p.productId, soldUnits: p.soldUnits, updatedAt: p.updatedAt })) );

        await db.disconnect();

        return true;
    } catch( error ) {
        console.log( error );
        return false;
    }

}