import { isValidObjectId } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { Paid } from '../../../interfaces';
import { Order } from '../../../models';

type Data =
| { error: boolean; message: string; }

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch( req.method ) {
        case 'POST':
            return getUserOrders( req, res );
        
        case 'PUT':
            return updateOrderPaid( req, res );

        default:
            return res.status(400).json({ error: true, message: 'BAD REQUEST' });
    }

}

const getUserOrders = async ( req: NextApiRequest, res: NextApiResponse ) => {

    const { id = '' } = req.query;

    if ( !id || !isValidObjectId( id ) ) return res.status(400).json({ error: true, message: 'El id de la órden no es válido' });

    try {
        await db.connect();

        const orders = await Order.find({ user: id });

        if ( !orders ) {
            await db.disconnect();
            return res.status(400).json({ error: true, message: 'No se encontraron órdenes' });
        }

        await db.disconnect();

        return res.status(200).json( orders );
    } catch( error ) {
        console.log( error );
        await db.disconnect();
        return res.status(500).json({ error: true, message: 'Ocurrió un error accediendo a la DB' })
    }

}

const updateOrderPaid = async ( req: NextApiRequest, res: NextApiResponse ) => {

    const { id = '', status = '' } = req.query;

    if ( !id || !isValidObjectId( id ) || !status ) return res.status(400).json({ error: true, message: 'La información está incompleta' });

    try {
        await db.connect();

        const order = await Order.findById( id );

        if ( !order ) {
            await db.disconnect();
            return res.status(400).json({ error: true, message: 'No se encontró órden con ese id' });
        }

        order.transaction.status = status.toString() as Paid;
        await order.save();

        await db.disconnect();

        return res.status(200).json({ error: false, message: 'La órden fue actualizada' })
    } catch( error ) {
        console.log( error );
        await db.disconnect();
        return res.status(500).json({ error: true, message: 'Ocurrió un error accediendo a la DB' })
    }

}