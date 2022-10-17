import type { NextApiRequest, NextApiResponse } from 'next'
import { isValidObjectId } from 'mongoose';
import { db } from '../../../database';
import { Order } from '../../../models';

type Data =
| { error: boolean; message: string; }

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch( req.method ) {
        case 'POST':
            return saveOrder( req, res );

        default:
            return res.status(400).json({ error: true, message: 'BAD REQUEST' })
    }
    
}

const saveOrder = async ( req: NextApiRequest, res: NextApiResponse ) => {

    const { user = '', orderItems = [], total = 0, shippingAddress = { address: '', maps: { latitud: null, longitude: null, } }, contact = { facebook: '', instagram: '', google: '' } } = req.body;
    // Object.values( shippingAddress ).filter(d => d).length < 2
    if ( !user || !isValidObjectId( user ) || orderItems.length < 1 || total === 0 || shippingAddress.address.length < 5 || Object.values( shippingAddress.maps ).filter(d => d).length < 2 || Object.values( contact ).filter(d => d).length < 1 )
        return res.status(400).json({ error: true, message: 'Faltan datos de la orden' });

    try {
        await db.connect();

        const newOrder = new Order({
            user,
            orderItems,
            total,
            shippingAddress,
            contact,
        });
        await newOrder.save();

        await db.disconnect();

        return res.status(200).json({ error: false, message: 'La orden fue creada con éxito' });
    } catch( error ) {
        console.log( error );
        await db.disconnect();
        return res.status(400).json({ error: true, message: 'Ocurrió un error creando la orden' });
    }

}