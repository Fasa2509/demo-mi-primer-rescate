import type { NextApiRequest, NextApiResponse } from 'next';
import { isValidObjectId } from 'mongoose';
import nodemailer from 'nodemailer';
import { format as formatDate } from 'date-fns';
import haversine from 'haversine-distance';

import { db } from '../../../database';
import { Dolar, Order, Product, User } from '../../../models';
import { IOrder, IOrderProduct, IPaypal } from '../../../interfaces';
import { format } from '../../../utils';
import axios from 'axios';

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


const getPaypalBearerToken = async (): Promise<string | null> => {

    const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

    const base64Token = Buffer.from(`${ PAYPAL_CLIENT }:${ PAYPAL_SECRET }`, 'utf-8').toString('base64');
    
    const body = new URLSearchParams('grant_type=client_credentials');

    try {
        const { data } = await axios.post( process.env.PAYPAL_OAUTH_URL || '', body, {
            headers: {
                'Authorization': `Basic ${ base64Token }`,
                'Content-Type': 'application/x-www-form-url-encoded',
            }
        });
        
        return data.access_token;
    } catch( error ) {
        if ( axios.isAxiosError( error ) ) {
            console.log( error.response?.data );
        } else {
            console.log( error );
        }

        return null;
    }
}


const saveOrder = async ( req: NextApiRequest, res: NextApiResponse ) => {

    let { user = '', orderItems = [], shippingAddress = { address: '', maps: { latitud: null, longitude: null, } }, contact = { name: '', facebook: '', instagram: '', whatsapp: '' }, transaction } = req.body;

    if ( !isValidObjectId( user ) || orderItems.length < 1 || shippingAddress.address.length < 5 || Object.values( shippingAddress.maps ).filter(d => d).length < 2 || Object.values( contact ).filter(d => d).length < 1 )
        return res.status(400).json({ error: true, message: 'Faltan datos de la ??rden' });
        
    if ( !contact.name || Object.values( contact ).filter(c => typeof c === 'string' && c.length > 0).length < 2 ) 
        return res.status(400).json({ error: true, message: 'La informaci??n de la ??rden es incorrecta' });
        
    const validMethods = ['Pago m??vil', 'Paypal'];

    if ( !( transaction instanceof Object ) || !validMethods.includes( transaction.method ) || !transaction.transactionId )
        return res.status(400).json({ error: true, message: 'La informaci??n de la ??rden no es correcta' });

    const distance = haversine(
        { longitude: Number(process.env.NEXT_PUBLIC_MPR_LONGITUDE || 0), latitude: Number(process.env.NEXT_PUBLIC_MPR_LATITUDE  || 0)},
        { longitude: shippingAddress.longitude, latitude: shippingAddress.latitude },
    );

    if ( distance > 11000 )
        return res.status(400).json({ error: true, message: 'Vaya, parece que est??s demasiado lejos' });
        
    try {
        let value;
        if ( transaction.method === 'Paypal' ) {
            const paypalBearerToken = await getPaypalBearerToken();
    
            const { transactionId } = transaction;
                
            if ( !paypalBearerToken )
                return res.status(400).json({ error: true, message: 'Ocurri?? un error accediendo a PayPal' });
                
            const { data } = await axios.get<IPaypal.PaypalOrderStatusResponse>(`${ process.env.PAYPAL_ORDERS_URL }/${ transactionId }`, {
                headers: {
                    'Authorization': `Bearer ${ paypalBearerToken }`,
                },
            });
    
            if ( data.status !== 'COMPLETED' )
                return res.status(400).json({ error: true, message: 'La ??rden no fue pagada' });
    
            value = data.purchase_units[0].amount.value;
        }
        
        await db.connect();

        const userBuyer = await User.findById( user );

        if ( !userBuyer ) {
            await db.disconnect();
            return res.status(400).json({ error: true, message: 'La informaci??n del usuario no es correcta' });
        }

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
                return res.status(400).json({ error: true, message: 'No se encontr?? uno de los productos' });
            }

            // @ts-ignore
            const isLowerQuantity = productInDb.inStock[p.size] < p.quantity;

            if ( isLowerQuantity ) {
                await db.disconnect();
                return res.status(400).json({ error: true, message: `No tenemos suficientes ${ p.name }${ p.size !== 'unique' ? ` (${ p.size })` : '' }` });
            }
        }

        let total = 0;

        products.forEach(async ( p ) => {
            const productsInOrder: IOrderProduct[] = orderItems.filter(( item: IOrderProduct ) => item._id === p._id.toString());

            if ( productsInOrder.length === 0 ) return;

            productsInOrder.forEach(( orderProduct ) => {
                // @ts-ignore
                p.inStock[ orderProduct.size ] -= orderProduct.quantity;
                p.sold += orderProduct.quantity;
                total += orderProduct.quantity * p.price * (1 - p.discount);
            });

            await p.save();
            return;
        });

        let dolarPrice = await Dolar.findOne({ price: { $gt: 0 }});

        if ( !dolarPrice ) {
            await db.disconnect();
            return res.status(400).json({ error: true, message: 'Ocurri?? un error creando la ??rden' });
        }

        const newOrder = new Order({
            user,
            orderItems,
            shippingAddress,
            contact,
            transaction: {
                ...transaction,
                status: 'pending',
                totalUSD: total.toFixed( 2 ),
                paidUSD: transaction.method === 'Paypal' ? value : total.toFixed( 2 ), // value obtenido de PayPal
                // @ts-ignore
                totalBs: ( total * dolarPrice.price ).toFixed( 2 ),
            },
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
                rejectUnauthorized: false,
            }
        });

        let info = await transporter.sendMail({
            from: '"Mi Primer Rescate ????" <miprimerrescate@gmail.com>', // sender address
            to: userBuyer.email, // list of receivers
            subject: "MPR - Nueva ??rden ???", // Subject line
            html: `
            <h1>Mi Primer Rescate</h1>
            <p>??Gracias por comprar en nuestra tienda virtual! ???????????????</p>
            <p>Cada compra contribuye a que podamos seguir realizando nuestra labor.</p>
            <p>Aqu?? un resumen de tu compra.</p>
            <br />
            <h2>ID de la ??rden</h2>
            <p>${ newOrder._id.toString() }</p>
            <br />
            <h2>Info de la Compra</h2>
            <p>${ newOrder.transaction.method }: ${ newOrder.transaction.transactionId }${ ( newOrder.transaction.method === 'Pago m??vil' && newOrder.transaction.phone ) ? `, ${ newOrder.transaction.phone }` : '' }</p>
            <br />
            <h2>Productos</h2>
            ${ newOrder.orderItems.map(( item ) => `<p>${ item.name }${ item.size !== 'unique' ? ` (${ item.size })` : '' }, ${ item.quantity } unidad${ item.quantity > 1 ? 'es' : '' } x ${ format(item.price * ( 1 - item.discount )) } = ${ format(item.quantity * item.price * ( 1 - item.discount )) }</p>`).join('') }
            <br />
            <h2>Total</h2>
            <p>${ format( newOrder.transaction.totalUSD ) } = Bs. ${ newOrder.transaction.totalBs.toFixed(2) }</p>
            <br />
            <h2>??rden creada el</h2>
            <p>${ formatDate( newOrder.createdAt, 'dd/MM/yyyy hh:mm:ssaa' ).toLowerCase() }</p>
            <br />
            <h2>Sitio de entrega</h2>
            <p>${ newOrder.shippingAddress.address }</p>
            <br />
            <p>Haz click en el siguiente enlace para ver la informaci??n de la ??rden en tu perfil.</p>
            <br />
            <a href='${ process.env.NEXTAUTH_URL }/personal' target='_blank' rel='noreferrer'>Ver perfil</a>
            `, // html body
        });

        return res.status(200).json({ error: false, message: 'La orden fue creada con ??xito' });
    } catch( error ) {
        console.log( error );
        await db.disconnect();
        return res.status(400).json({ error: true, message: 'Ocurri?? un error creando la orden' });
    }

}