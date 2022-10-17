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
            
        case 'PUT':
            return updateProductInfo( req, res );
                
        default:
            return res.status(400).json({ error: true, message: 'BAD REQUEST' });
    }

}

const updateProductInfo = async ( req: NextApiRequest, res: NextApiResponse ) => {

    const { id = '' } = req.query;
    const { name = '', description = '', price = 0, discount = 0, inStock, tags = [], unique: unica } = req.body;
    const { unique = 0, S = 0, M = 0, L = 0, XL = 0, XXL = 0, XXXL = 0 } = inStock;

    if ( !id || !isValidObjectId( id ) ) return res.status(400).json({ error: true, message: 'El id no es válido' });

    if ( !description || price === 0 || discount > 50 || discount < 0 || tags.length === 0 || tags.length > 4 ) return res.status(400).json({ error: true, message: 'La información no es válida' });

    try {
        await db.connect();

        if ( unica ) {
            const product = await Product.findById( id );

            product.name = name;
            product.description = description;
            product.price = price;
            product.discount = discount / 100;
            
            product.inStock.unique += unique;
            
            product.tags = [...tags];
            await product.save();
        } else {
            const product = await Product.findById( id ) 

            product.name = name;
            product.description = description;
            product.price = price;
            product.discount = discount / 100;
            
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