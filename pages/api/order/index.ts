import type { NextApiRequest, NextApiResponse } from 'next'
import { isValidObjectId } from 'mongoose';
import { db } from '../../../database';
import { Order, Product } from '../../../models';
import { IOrder, IOrderProduct } from '../../../interfaces';

type Data =
| { error: boolean; message: string; }

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch( req.method ) {
        case 'POST':
            return saveOrder( req, res );

        default:
            return res.status(400).json({ error: true, message: 'BAD REQUEST' });
    }
    
}

const saveOrder = async ( req: NextApiRequest, res: NextApiResponse ) => {

    const { user = '', orderItems = [], shippingAddress = { address: '', maps: { latitud: null, longitude: null, } }, contact = { name: '', facebook: '', instagram: '', whatsapp: '' }, transaction } = req.body;

    if ( !user || !isValidObjectId( user ) || orderItems.length < 1 || shippingAddress.address.length < 5 || Object.values( shippingAddress.maps ).filter(d => d).length < 2 || Object.values( contact ).filter(d => d).length < 1 )
        return res.status(400).json({ error: true, message: 'Faltan datos de la órden' });
        
    if ( !contact.name || Object.values( contact ).filter(c => typeof c === 'string' && c.length > 0).length < 2 ) 
        return res.status(400).json({ error: true, message: 'La información de la órden es incorrecta' });
        
    if ( !transaction || !( transaction instanceof Object ) || !transaction.method || !transaction.status || !transaction.transactionId || !transaction.totalUSD || !transaction.totalBs )
        return res.status(400).json({ error: true, message: 'Información de la órden no es correcta' });

    try {
        await db.connect();

        const orderItemsId = Array.from(new Set( orderItems.map(( order: IOrder ) => order._id ) ));

        const products = await Product.find({ _id: { $in: orderItemsId } });

        if ( !products || products.length < 1 ) return res.status(400).json({ error: true, message: 'No se encontraron productos' });

        for ( let p of orderItems ) {
            const productInDb = products.find(( item ) => item._id.toString() === p._id );

            if ( !productInDb ) {
                await db.disconnect();
                return res.status(400).json({ error: true, message: 'No se encontró uno de los productos' });
            }
            
            // @ts-ignore
            const isLowerQuantity = productInDb.inStock[p.size] < p.quantity;

            if ( isLowerQuantity ) {
                await db.disconnect();
                return res.status(400).json({ error: true, message: `No tenemos suficientes ${ p.name }${ p.size !== 'unique' ? ` (${ p.size })` : '' }` });
            }
        }

        products.forEach(async ( p ) => {
            const productsInOrder: IOrderProduct[] = orderItems.filter(( item: IOrderProduct ) => item._id === p._id.toString());

            let unitsSold = 0;

            productsInOrder.forEach(( orderProduct ) => {
                // @ts-ignore
                p.inStock[ orderProduct.size ] -= orderProduct.quantity;
                p.sold += orderProduct.quantity;
                unitsSold += orderProduct.quantity;
            });

            await p.save();
        });

        const newOrder = new Order({
            user,
            orderItems,
            shippingAddress,
            contact,
            transaction,
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