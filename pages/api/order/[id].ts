import { isValidObjectId } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { Paid } from '../../../interfaces';
import { Order } from '../../../models';

type Data =
| { error: boolean; message: string; }

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch( req.method ) {
        case 'PUT':
            return updateOrderPaid( req, res );

        default:
            return res.status(400).json({ error: true, message: 'BAD REQUEST' })
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
            return res.status(400).json({ error: true, message: 'No se encontró orden con ese id' });
        }

        order.isPaid = status.toString() as Paid;
        await order.save();

        await db.disconnect();

        return res.status(200).json({ error: false, message: 'La orden fue actualizada' })
    } catch( error ) {
        console.log( error );
        await db.disconnect();
        return res.status(500).json({ error: true, message: 'Ocurrió un error accediendo a la DB' })
    }

}