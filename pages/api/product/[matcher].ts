import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '../auth/[...nextauth]';
import nodemailer from 'nodemailer';
import { db } from '../../../database';
import { Product, User } from '../../../models';

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

    const session = await getServerSession( req, res, nextAuthOptions );

    if ( !session || !session.user )
        return res.status(400).json({ error: true, message: 'Debes iniciar sesión' });
        
    const validRoles = ['superuser', 'admin'];
        
        // @ts-ignore
    if ( !validRoles.includes( session.user.role ) )
        return res.status(400).json({ error: true, message: 'Acceso denegado' });    

    try {
        await db.connect();

        if ( validTags.includes( matcher ) ) {
            ( matcher === 'todos' )
                ? await Product.updateMany({}, { $set: { discount }})
                : await Product.updateMany({ tags: matcher }, { $set: { discount }});
        } else {
            matcher = matcher.toLocaleLowerCase();
            const product = await Product.findOne({ slug: matcher });

            if ( !product ) {
                await db.disconnect();
                return res.status(400).json({ error: true, message: 'No se encontró el producto' });
            }

            product.discount = discount;
            await product.save();
        }

        const usersInfo: { name: string; email: string }[] = await User
            .find({ isSubscribed: true })
            .select('email name -_id')
            .lean();

        await db.disconnect();

        if ( validTags.includes( matcher ) ) {
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

            const objectDiscount = {
                accesorios: 'de accesorios',
                consumibles: 'consumibles',
                ropa: 'de ropa',
                útil: 'útiles',
            }

            let infoDiscount = ( matcher === 'todos' )
                ? 'para todos nuestros productos'
                // @ts-ignore
                : `para nuestros productos ${ objectDiscount[matcher] }`;

            let info = await transporter.sendMail({
                from: '"Mi Primer Rescate 👻" <miprimerrescate@gmail.com>', // sender address
                to: usersInfo.map(( i ) => i.email), // list of receivers
                subject: "MPR - ¡Descuentos! ✔", // Subject line
                html: `
                <h1>Mi Primer Rescate</h1>
                <p>¡Hay un nuevo descuento en nuestra tienda virtual! 🛍️🐱🐶</p>
                <p>Oye, tenemos nuevos descuentos en nuestra tienda ${ infoDiscount }, no pierdas la oportunidad de consentir aún más a tus mascotas.</p>
                <br />
                <h2>¿Qué esperas? Ven a ver antes de que se acabe esta promoción.</h2>
                <a href='${ process.env.NEXTAUTH_URL }/tienda' target='_blank' rel='noreferrer'>Visitar tienda</a>
                `, // html body
            });
        }
        
        return res.status(200).json({ error: false, message: 'El descuento fue aplicado' });
    } catch( error ) {
        console.log( error );
        await db.disconnect();
        return res.status(500).json({ error: true, message: 'Ocurrió un error en la DB' });
    }

}