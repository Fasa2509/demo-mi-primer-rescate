import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '../auth/[...nextauth]';
import nodemailer from 'nodemailer';
import { db } from '../../../database';
import { Article, User } from '../../../models';

type Data =
| { error: boolean; message: string; }

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch( req.method ) {
        case 'GET':
            return getMoreArticles( req, res );
        
        case 'POST':
            return createArticle( req, res );

        default:
            return res.status(400).json({ error: true, message: 'BAD REQUEST' });
    }

}

const getMoreArticles = async ( req: NextApiRequest, res: NextApiResponse) => {

    let { seconds = 0 } = req.query;

    seconds = Number(seconds.toString());

    try {
        await db.connect();

        const articles = await Article.find({ createdAt: { $lt: seconds } }).sort({ createdAt: -1 }).limit( 5 );

        await db.disconnect();

        return res.status(200).json( articles );
    } catch( error ) {
        console.log( error );
        await db.disconnect();
        return res.status(400).json({ error: true, message: 'Ocurrió un error buscando los artículos' });
    }

}

const createArticle = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { title = '', fields = [] } = req.body;

    const session = await getServerSession( req, res, nextAuthOptions );

    if ( !session || !session.user )
        return res.status(400).json({ error: true, message: 'Debes iniciar sesión' });

    const validRoles = ['superuser', 'admin'];
        
        // @ts-ignore
    if ( !validRoles.includes( session.user.role ) )
        return res.status(400).json({ error: true, message: 'Acceso denegado' });    

    if ( !title || fields.length < 1 ) return res.status(400).json({ error: true, message: 'Faltan campos para crear el artículo' });

    try {
        await db.connect();
            
        const newArticle = new Article({ title, fields });
        await newArticle.save();

        const usersInfo: { name: string; email: string }[] = await User
            .find({ isSubscribed: true })
            .select('-_id name email')
            .lean();

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

        await transporter.sendMail({
            from: '"Mi Primer Rescate 👻" <miprimerrescate@gmail.com>', // sender address
            to: usersInfo.map(( i ) => i.email), // list of receivers
            subject: "MPR - ¡Novedades! ✔", // Subject line
            html: `
            <h1>Mi Primer Rescate</h1>
            <p>¡Hola! Hay novedades en nuestra página, ¡ven a verlas ya! 🐱🐶</p>
            <p>Acabamos de publicar un nuevo artículo, ${ title }, para mantenerte al día sobre lo que hacemos en nuestra fundación, no te lo pierdas.</p>
            <br />
            <a href='${ process.env.NEXTAUTH_URL }' target='_blank' rel='noreferrer'>Ven a ver qué hay de nuevo</a>
            `, // html body
        });
        
        return res.status(200).json({ error: false, message: '¡El artículo fue guardado!' });
    } catch( error ) {
        console.log( error );
        await db.disconnect();
        return res.status(400).json({ error: true, message: 'Ocurrió un error en la DB' });
    }
}