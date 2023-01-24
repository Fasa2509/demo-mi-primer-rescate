import axios from "axios";
import { db } from ".";
import { mprApi } from "../mprApi";
import { IProduct } from "../interfaces";
import { Dolar, Product } from "../models";
import { Sizes } from '../interfaces/products';

export const backGetDolarPrice = async (): Promise< Number | null> => {

    try {
        await db.connect();
        
        let dolarPrice = await Dolar.findOne({ price: { $gt: 0 }});
        
        await db.disconnect();
        
        return dolarPrice ? dolarPrice.price : 10;
    } catch( error ) {
        return null;
    }

}

export const frontGetDolarPrice = async (): Promise< number | null> => {

    try {
        let { data } = await mprApi.get('/product/existency');

        return data.price;
    } catch( error ) {
        return null;
    }

}

export const updateDolarPrice = async ( price: number ): Promise<{ error: boolean; message: string; }> => {

    if ( price === 0 ) return { error: true, message: 'El precio no es válido' };

    try {
        let { data } = await mprApi.put('/product/existency', { price: price.toFixed(2) });

        return data;
    } catch( error ) {

        if ( axios.isAxiosError( error ) ) {
            return error.response?.data as { error: boolean; message: string; };
        }

        return {
            error: true,
            message: 'Error actualizando valor',
        };
    }

}

export const checkProductsExistency = async ( productsToCheck: Array<{ _id: string; name: string; quantity: number; size: Sizes; }> ): Promise<{ error: boolean; message: string; payload: string[]; }> => {

    if ( !(productsToCheck instanceof Array) || productsToCheck.length < 1 ) return { error: true, message: '', payload: ['El carrito está vacío'] }

    try {
        let { data } = await mprApi.post('/product/existency', {
            productsToCheck
        });

        return data;
    } catch( error ) {

        if ( axios.isAxiosError( error ) ) {
            return {
                error: true,
                message: '',
                // @ts-ignore
                payload: error.response ? error.response.data.payload || ['Error'] : ['Error en la petición'],
            }
        }

        return {
            error: true,
            message: '',
            payload: ['Error'],
        };
    }
}

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
            slug,
            unica,
        });

        return data;
    } catch( error ) {

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

export const discountProducts = async (discount: number, matcher: string ): Promise<{ error: boolean; message: string; }> => {

    if ( discount < 0 || discount > 50 ) return { error: true, message: 'El descuento no es válido' };

    try {
        matcher = matcher.replace('/', '');
        const { data } = await mprApi.get(`/product/${ matcher }?discount=${ discount }`);

        return data;
    } catch( error: any ) {

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

export const switchProductAbilityById = async ( id: string ) => {

    try {
        const { data } = await mprApi.delete(`/product?id=${ id }`);

        return data;
    } catch( error: any ) {

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

export const getProductBySlug = async ( slug: string ): Promise<IProduct | null | false> => {

    try {
        await db.connect();

        const product = await Product.findOne({ slug, isAble: true });

        await db.disconnect();

        if ( !product ) return false;

        return JSON.parse( JSON.stringify( product ) );
    } catch( error ) {
        return null;
    }

}

export const getAllProducts = async (): Promise<IProduct[] | null> => {

    try {
        await db.connect();
        
        const products = await Product.find().sort({ createdAt: -1 });

        await db.disconnect();

        return JSON.parse( JSON.stringify( products ) );
    } catch( error ) {
        return null;
    }

};