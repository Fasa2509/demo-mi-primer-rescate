import { db } from ".";
import { IProduct } from "../interfaces";
import { Product } from "../models";

export const getProductBySlug = async ( slug: string ): Promise<IProduct | null> => {

    try {
        await db.connect();

        const product = await Product.findOne({ slug });

        await db.disconnect();

        return JSON.parse( JSON.stringify( product ) );
    } catch( error ) {
        console.log( error );
        return null;
    }

}

export const getAllProducts = async (): Promise<IProduct[] | null> => {

    try {
        await db.connect();
        
        const products = await Product.find();

        await db.disconnect();

        return JSON.parse( JSON.stringify( products ) );
    } catch( error ) {
        console.log( error );
        return null;
    }

};