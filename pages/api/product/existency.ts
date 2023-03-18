import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { db } from '../../../database';
import { Dolar, Product } from '../../../models';
import { nextAuthOptions } from '../auth/[...nextauth]';

type Data =
| { error: boolean; message: string; payload: string[]; }
| { error: boolean; message: string; }

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch( req.method ) {
        case 'GET':
            return getDolarPrice( req, res );

        case 'POST':
            return checkExistency( req, res );

        case 'PUT':
            return updateDolarPrice( req, res );

        default:
            return res.status(400).json({ error: true, message: '', payload: ['BAD REQUEST!'] });
    }

};

const getDolarPrice = async ( req: NextApiRequest, res: NextApiResponse ) => {

    try {
        await db.connect();

        const dolarPrice = await Dolar.findOne({ price: { $gt: 0 } });

        await db.disconnect();

        return res.status(200).json( dolarPrice || { price: 1 } );
    } catch( error ) {
        console.log( error );
        await db.disconnect();
        return res.status(400).json({ error: true, message: 'Ocurrió un error actualizando el valor' });
    }

}

const checkExistency = async ( req: NextApiRequest, res: NextApiResponse ) => {

    const { productsToCheck = [] } = req.body;

    if ( !(productsToCheck instanceof Array) || productsToCheck.length < 1 ) return res.status(400).json({ error: true, message: '', paylaod: ['El carrito está vacío'] });

    try {
        const rejectedProducts: string[] = [];

        await db.connect();

        const productsToCheckId = Array.from(new Set( productsToCheck.map(( p: any ) => p._id ) ));

        const products = await Product.find({ _id: { $in: productsToCheckId } });

        if ( !products || products.length < 1 ) {
            await db.disconnect();
            return res.status(400).json({ error: true, message: '', payload: 'Ocurrió un error buscando los productos' });
        }

        for ( let p of productsToCheck ) {
            const productInDb = products.find(( item ) => item._id.toString() === p._id );

            if ( !productInDb ) {
                await db.disconnect();
                return res.status(400).json({ error: true, message: '', payload: 'No se encontró uno de los productos' });
            }
            
            // @ts-ignore
            const isLowerQuantity = productInDb.inStock[p.size] < p.quantity;

            if ( isLowerQuantity ) rejectedProducts.push( `No tenemos suficientes ${ p.name }${ p.size !== 'unique' ? ` (${ p.size })` : '' }` );
        }

        await db.disconnect();

        if ( rejectedProducts.length > 0 ) {
            await db.disconnect();
            return res.status(200).json({ error: true, message: '', payload: rejectedProducts });
        }

        return res.status(200).json({ error: false, message: '¡Todos los productos están disponibles!', payload: [] });
    } catch( error ) {
        console.log( error );
        await db.disconnect();
        return res.status(400).json({ error: true, message: '', payload: ['Ocurrió un error revisando las existencias'] });
    }

}

const updateDolarPrice = async ( req: NextApiRequest, res: NextApiResponse ) => {

    const { price } = req.body;

    if ( price === 0 ) return res.status(400).json({ error: true, message: 'El valor no es válido' });

    const session = await unstable_getServerSession( req, res, nextAuthOptions );

    if ( !session || !session.user )
        return res.status(400).json({ error: true, message: 'Debes iniciar sesión' });
        
    const validRoles = ['superuser', 'admin'];
        
        // @ts-ignore
    if ( !validRoles.includes( session.user.role ) )
        return res.status(400).json({ error: true, message: 'Acceso denegado' });

    try {
        await db.connect();

        const dolarPrice = await Dolar.findOne({ price: { $gt: 0 } });

        if ( !dolarPrice ) {
            const newPrice = new Dolar({ price });
            
            await newPrice.save();

            await db.disconnect();
            
            return res.status(200).json({ error: false, message: 'El valor del dólar fue establecido' });
        };

        const relation = price / Number( dolarPrice.price );

        if ( relation <= 0.7 ) {
            await db.disconnect();
            return res.status(400).json({ error: true, message: 'El nuevo valor es muy pequeño comparado al anterior' });
        }

        dolarPrice.price = price;
        await dolarPrice.save();

        await db.disconnect();

        return res.status(200).json({ error: false, message: 'El valor del dólar fue actualizado' });
    } catch( error ) {
        console.log( error );
        await db.disconnect();
        return res.status(400).json({ error: true, message: 'Ocurrió un error actualizando el valor' });
    }

}