import type { NextApiRequest, NextApiResponse } from 'next'
import { isValidObjectId } from 'mongoose';
import { db } from '../../../database';
import { Product } from '../../../models';

type Data =
| { error: boolean; message: string; }

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch( req.method ) {
        case 'GET':
            return applyDiscountToProducts( req, res );

        default:
            return res.status(400).json({ error: true, message: 'BAD REQUEST' });
    }

}

const applyDiscountToProducts = async ( req: NextApiRequest, res: NextApiResponse ) => {

    let { discount = -1, matcher = '' } = req.query;
    discount = Number( discount );
    matcher = matcher.toString();

    if ( isNaN( discount ) || discount < 0 || discount > 50 ) return res.status(400).json({ error: true, message: 'El descuento no es válido'});

    discount /= 100;

    const validTags = ['accesorios', 'consumibles', 'ropa', 'útil', 'todos'];

    try {
        await db.connect();

        if ( validTags.includes( matcher ) ) {
            ( matcher === 'todos' )
                ? await Product.updateMany({}, { $set: { discount }})
                : await Product.updateMany({ tags: matcher }, { $set: { discount }});
        } else {
            matcher = '/' + matcher;
            const product = await Product.findOne({ slug: matcher });

            if ( !product ) {
                await db.disconnect();
                return res.status(400).json({ error: true, message: 'No se encontró el producto' });
            }

            product.discount = discount;
            await product.save();
        }

        await db.disconnect();
        
        return res.status(200).json({ error: false, message: 'El descuento fue aplicado' });
    } catch( error ) {
        console.log( error );
        await db.disconnect();
        return res.status(500).json({ error: true, message: 'Ocurrió un error en la DB' });
    }

}