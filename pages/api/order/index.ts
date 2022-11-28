import type { NextApiRequest, NextApiResponse } from 'next';
import { isValidObjectId } from 'mongoose';
import nodemailer from 'nodemailer';
import { format as formatDate } from 'date-fns';

import { db } from '../../../database';
import { Order, Product, User } from '../../../models';
import { IOrder, IOrderProduct } from '../../../interfaces';
import { format } from '../../../utils';

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

    let { user = '', orderItems = [], shippingAddress = { address: '', maps: { latitud: null, longitude: null, } }, contact = { name: '', facebook: '', instagram: '', whatsapp: '' }, transaction } = req.body;

    if ( !user || !isValidObjectId( user ) || orderItems.length < 1 || shippingAddress.address.length < 5 || Object.values( shippingAddress.maps ).filter(d => d).length < 2 || Object.values( contact ).filter(d => d).length < 1 )
        return res.status(400).json({ error: true, message: 'Faltan datos de la órden' });
        
    if ( !contact.name || Object.values( contact ).filter(c => typeof c === 'string' && c.length > 0).length < 2 ) 
        return res.status(400).json({ error: true, message: 'La información de la órden es incorrecta' });
        
    if ( !transaction || !( transaction instanceof Object ) || !transaction.method || !transaction.status || !transaction.transactionId || !transaction.totalUSD || !transaction.totalBs )
        return res.status(400).json({ error: true, message: 'Información de la órden no es correcta' });

    try {
        await db.connect();

        const userBuyer = await User.findById( user );

        if ( !userBuyer )
            return res.status(400).json({ error: true, message: 'Información del usuario no es correcta' });

        const orderItemsId = Array.from(new Set( orderItems.map(( order: IOrder ) => order._id ) ));

        const products = await Product.find({ _id: { $in: orderItemsId } });

        if ( !products || products.length < 1 ) {
            await db.disconnect();   
            return res.status(400).json({ error: true, message: 'No se encontraron productos' });
        }

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

            if ( productsInOrder.length === 0 ) return;

            productsInOrder.forEach(( orderProduct ) => {
                // @ts-ignore
                p.inStock[ orderProduct.size ] -= orderProduct.quantity;
                p.sold += orderProduct.quantity;
            });

            await p.save();
            return;
        });

        const newOrder = new Order({
            user,
            orderItems,
            shippingAddress,
            contact,
            transaction,
        });
        
        await newOrder.save();

        userBuyer.orders = [newOrder._id, ...userBuyer.orders];
        await userBuyer.save();

        await db.disconnect();

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
              user: process.env.MAILER__USER,
              pass: process.env.MAILER__PASS,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        let info = await transporter.sendMail({
            from: '"Mi Primer Rescate 👻" <miprimerrescate@gmail.com>', // sender address
            to: userBuyer.email, // list of receivers
            subject: "MPR - Nueva Órden ✔", // Subject line
            html: `
            <h1>Mi Primer Rescate</h1>
            <p>¡Gracias por comprar en nuestra tienda virtual! 🐱🐶🛍️</p>
            <p>Cada compra contribuye a que podamos seguir realizando nuestra labor.</p>
            <p>Aquí un resumen de tu compra.</p>
            <br />
            <h2>ID de la Órden</h2>
            <p>${ newOrder._id.toString() }</p>
            <br />
            <h2>ID de la Compra</h2>
            <p>${ newOrder.transaction.method } ${ newOrder.transaction.transactionId }</p>
            <br />
            <h2>Productos</h2>
            ${ newOrder.orderItems.map(( item ) => `<p>${ item.name }${ item.size !== 'unique' ? ` (${ item.size })` : '' }, ${ item.quantity } unidad${ item.quantity > 1 ? 'es' : '' } x ${ (item.price * ( 1 - item.discount )).toFixed(2) } = ${ format(item.quantity * item.price * ( 1 - item.discount )) }</p>`).join('') }
            <br />
            <h2>Total</h2>
            <p>${ format( newOrder.transaction.totalUSD ) } = Bs. ${ newOrder.transaction.totalBs.toFixed(2) }</p>
            <br />
            <br />
            <h2>Órden creada el</h2>
            <p>${ formatDate( newOrder.createdAt, 'dd/MM/yyyy hh:mm:ssaa' ).toLowerCase() }</p>
            <br />
            <h2>Sitio de entrega</h2>
            <p>${ newOrder.shippingAddress.address }</p>
            <br />
            <p>Haz click en el siguiente enlace para ver la información de la órden en tu perfil.</p>
            <br />
            <a href='${ process.env.NEXTAUTH_URL }/personal' target='_blank' rel='noreferrer'>Ver perfil</a>
            `, // html body
        });

        return res.status(200).json({ error: false, message: 'La orden fue creada con éxito' });
    } catch( error ) {
        console.log( error );
        await db.disconnect();
        return res.status(400).json({ error: true, message: 'Ocurrió un error creando la orden' });
    }

}