import { isValidObjectId } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { Product } from '../../../models';

type Data =
| { error: boolean; message: string; }

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch( req.method ) {
        case 'GET':
            return res.status(400).json({ error: true, message: 'BAD REQUEST' });
            
        case 'POST':
            return createNewProduct( req, res );

        case 'PUT':
            return updateProductInfo( req, res );
                
        case 'DELETE':
            return removeProduct( req, res );

        default:
            return res.status(400).json({ error: true, message: 'BAD REQUEST' });
    }

}

const createNewProduct = async ( req: NextApiRequest, res: NextApiResponse ) => {

    const { name = '', description = '', images = [], inStock, price = 0, discount, tags = [], slug = '', unica = undefined } = req.body;

    if ( !name || !description || images.length < 2 || images.length > 4 || price === 0 || discount > 50 || tags.length === 0 || !slug.startsWith('/') || unica === undefined )
        return res.status(400).json({ error: true, message: 'La información no es válida' });
        
    const { unique, ...tallas } = inStock;

    if ( unique !== -1 && Object.values( tallas ).some(( value, index, array ) => typeof value === 'number' && value > 0) )
        return res.status(400).json({ error: true, message: 'La cantidad de tallas no es válida' });

    try {
        await db.connect();

        const product = new Product({
            name,
            description,
            images,
            inStock:
                ( unica )
                ? {
                    unique: inStock.unique,
                    S: 0,
                    M: 0,
                    L: 0,
                    XL: 0,
                    XXL: 0,
                    XXXL: 0
                }
                : {
                    ...inStock,
                    unique: -1,
                },
            price,
            discount: discount / 100,
            tags,
            slug,
        });

        await product.save();

        await db.disconnect();
        
        return res.status(200).json({ error: false, message: 'El producto fue creado' });
    } catch( error ) {
        console.log( error );
        await db.disconnect();
        return res.status(500).json({ error: true, message: 'Ocurrió un error accediendo a la DB'});
    }

}

const updateProductInfo = async ( req: NextApiRequest, res: NextApiResponse ) => {

    const { id = '' } = req.query;
    const { name = '', description = '', images = [], price = 0, discount = 0, inStock, tags = [], unique: unica = undefined } = req.body;
    const { unique = 0, S = 0, M = 0, L = 0, XL = 0, XXL = 0, XXXL = 0 } = inStock;

    if ( !id || !isValidObjectId( id ) ) return res.status(400).json({ error: true, message: 'El id no es válido' });

    if ( !name || !description || images.length < 1 || images.length > 4 || price === 0 || discount > 50 || discount < 0 || tags.length === 0 || tags.length > 4 || unica === undefined ) return res.status(400).json({ error: true, message: 'La información no es válida' });
    
    let { unique: u, ...tallas } = inStock;
    // if ( unica && Object.values( tallas ).some(( value, index, array ) => typeof value === 'number' && value > 0) ) return res.status(400).json({ error: true, message: 'Error en la info de las tallas' });
    
    try {
        await db.connect();
        
        if ( unica ) {
            const product = await Product.findById( id );

            if ( product.inStock.unique !== -1 && Object.values( tallas ).some(( value, index, array ) => typeof value === 'number' && value > 0) ) return res.status(400).json({ error: true, message: 'Error en la info de las tallas' });
            if ( product.inStock.unique === -1 && inStock.unique >= 0 ) return res.status(400).json({ error: true, message: 'Error en la info de las tallas' });
            
            product.name = name;
            product.description = description;
            product.images = [...images];
            product.price = price;
            product.discount = discount / 100;
            
            product.inStock.unique += unique;
            product.inStock.S = 0;
            product.inStock.M = 0;
            product.inStock.L = 0;
            product.inStock.XL = 0;
            product.inStock.XXL = 0;
            product.inStock.XXXL = 0;
            
            product.tags = [...tags];
            await product.save();
        } else {
            const product = await Product.findById( id );

            if ( product.inStock.unique !== -1 && Object.values( tallas ).some(( value, index, array ) => typeof value === 'number' && value > 0) ) return res.status(400).json({ error: true, message: 'Error en la info de las tallas' });
            if ( product.inStock.unique === -1 && inStock.unique >= 0 ) return res.status(400).json({ error: true, message: 'Error en la info de las tallasssss' });

            product.name = name;
            product.description = description;
            product.price = price;
            product.discount = discount / 100;
            
            product.inStock.unique = -1;
            product.inStock.S += S;
            product.inStock.M += M;
            product.inStock.L += L;
            product.inStock.XL += XL;
            product.inStock.XXL += XXL;
            product.inStock.XXXL+= XXXL;
            product.tags = [...tags];
            await product.save();
        }

        await db.disconnect();
        return res.status(200).json({ error: false, message: 'El producto fue actualizado' })
    } catch( error ) {
        console.log( error );
        await db.disconnect();
        return res.status(400).json({ error: true, message: 'BAD REQUEST' });
    }

}

const removeProduct = async ( req: NextApiRequest, res: NextApiResponse ) => {
    
    const { id = '' } = req.query;

    if ( !isValidObjectId( id ) ) return res.status(400).json({ error: true, message: 'El id no es válido' })

    try {
        await db.connect();

        const product = await Product.findById( id );
        product.isAble = false;
        await product.save();

        await db.disconnect();

        return res.status(200).json({ error: false, message: 'El product fue eliminado' });
    } catch( error ) {
        console.log( error );
        await db.disconnect();
        return res.status(500).json({ error: true, message: 'Ocurrió un error en la DB' });
    }

}
