import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { allProducts } from '../../../interfaces';
import { Product } from '../../../models';

type Data =
| { error: boolean; message: string }

const validSeeds = [
    'products',
    'animales',
]

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    if ( req.method !== 'GET' ) return res.status(400).json({ error: true, message: "BAD REQUEST" });
    if ( !req.query.seed ) return res.status(400).json({ error: true, message: 'Debes indicar lo que vas a cargar a la DB' });
    if ( !validSeeds.includes( req.query.seed.toString() ) ) return res.status(400).json({ error: true, message: 'Esa query no existe' });

    if ( req.query.seed === 'products' ) return updateProducts( req, res );

    return res.status(201).json({ error: false, message: 'No hay data' })

}

const updateProducts = async ( req: NextApiRequest, res: NextApiResponse ) => {

    try {
        await db.connect();
        
        await Product.deleteMany();

        const actualProducts = allProducts.map(( product ) => {
            let { _id, ...p } = product;
            return p;
        })
        await Product.insertMany( actualProducts );
        
        await db.disconnect();
        
        return res.status(200).json({ error: false, message: 'Los productos fueron cargados' });
    } catch( error ) {
        console.log( error );
        await db.disconnect();
        return res.status(500).json({ error: true, message: "Updating products failed. Check server's logs" });
    }

}