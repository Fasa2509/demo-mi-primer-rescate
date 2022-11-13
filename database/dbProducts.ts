import axios from "axios";
import { db } from ".";
import { mprApi } from "../mprApi";
import { InStockSizes, IProduct, Tags } from "../interfaces";
import { Product } from "../models";

// interface PayloadUpdate {
//     name: string;
//     description: string;
//     price: number;
//     discount: number;
//     inStock: InStockSizes;
//     tags: Tags[];
// }

export const createNewProduct = async ( form: IProduct, unica: boolean, ): Promise<{ error: boolean; message: string; }> => {

    let { name = '', description = '', images = [], price = 0, discount = 0, inStock, tags = [], slug = '' } = form;
    
    if ( !name || !description || images.length < 2 || images.length > 4 || price === 0 || tags.length === 0 ) return { error: true, message: 'La información no es válida' };

    let { unique, ...tallas } = inStock;

    if ( unique > -1 && Object.values( tallas ).some(( value: number, index, array) => typeof value === 'number' && value > 0) ) return { error: true, message: 'Las tallas no son válidas' };

    try {
        let { data } = await mprApi.post('/product', {
            name,
            description,
            images,
            inStock,
            price,
            discount,
            tags,
            slug: slug.startsWith('/') ? slug : '/' + slug,
            unica,
        });

        return data;
    } catch( error ) {
        console.log( error );

        if ( axios.isAxiosError( error ) ) {
            return {
                error: true,
                // @ts-ignore
                message: error.response ? error.response.data.message || 'Error' : 'Error',
            }
        }

        return {
            error: true,
            message: 'Error',
        };
    }
}

export const updateProductById = async ( id: string, payload: IProduct, unique: boolean ): Promise<{ error: boolean; message: string; }> => {

    try {
        let res;

        if ( unique ) res = await mprApi.put(`/product?id=${ id }`, {
            ...payload,
            inStock: {
                ...payload.inStock,
                S: 0,
                M: 0,
                L: 0,
                XL: 0,
                XXL: 0,
                XXXL: 0,
            },
            unique,
        });

        if ( !unique ) res = await mprApi.put(`/product?id=${ id }`, {
            ...payload,
            inStock: {
                ...payload.inStock,
                unique: -1,
            },
            unique,
        });

        return res
            ? res.data
            : { error: true, message: 'Error en la petición' };
    } catch( error ) {
        console.log( error );

        if ( axios.isAxiosError( error ) ) {
            return {
                error: true,
                // @ts-ignore
                message: error.response ? error.response.data.message || 'Error gen' : 'Error',
            }
        }

        return {
            error: true,
            message: 'Error',
        };
    }

}

export const discountProducts = async ( form: 'tags' | 'slug', discount: number, matcher: string ): Promise<{ error: boolean; message: string; }> => {

    if ( discount < 0 || discount > 50 ) return { error: true, message: 'El descuento no es válido' };

    try {
        matcher = matcher.toString();
        if ( matcher.startsWith('/') ) matcher.replace('/', '');
        const { data } = await mprApi.get(`/product/${ matcher }?discount=${ discount }`);

        return data;
    } catch( error: any ) {
        console.log( error );

        if ( axios.isAxiosError( error ) ) {
            return {
                error: true,
                // @ts-ignore
                message: error.response ? error.response.data.message || 'Error gen' : 'Error',
            }
        }

        return {
            error: true,
            message: 'Error',
        };
    }

}

export const deleteProductById = async ( id: string ) => {

    try {
        const { data } = await mprApi.delete(`/product?id=${ id }`);

        return data;
    } catch( error: any ) {
        console.log( error );

        if ( axios.isAxiosError( error ) ) {
            return {
                error: true,
                // @ts-ignore
                message: error.response ? error.response.data.message || 'Error gen' : 'Error',
            }
        }

        return {
            error: true,
            message: 'Error',
        };
    }

}

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
        
        const products = await Product.find({ isAble: true });

        await db.disconnect();

        return JSON.parse( JSON.stringify( products ) );
    } catch( error ) {
        console.log( error );
        return null;
    }

};