import type { NextApiRequest, NextApiResponse } from 'next'
import { isValidObjectId } from 'mongoose';
import { db } from '../../../database';
import { Article } from '../../../models';
import { unstable_getServerSession } from 'next-auth';
import { nextAuthOptions } from '../auth/[...nextauth]';

type Data =
{ error: boolean; message: string }

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch( req.method ) {
        case 'DELETE':
            return removeArticle( req, res );

        default:
            return res.status(400).json({ error: true, message: 'BAD REQUEST' });
    }

}

const removeArticle = async ( req: NextApiRequest, res: NextApiResponse ) => {

    const { id: _id = '' } = req.query;

    if ( !_id || !isValidObjectId( _id ) ) return res.status(400).json({ error: true, message: 'El id no es válido' });

    const session = await unstable_getServerSession( req, res, nextAuthOptions );

    if ( !session || !session.user )
        return res.status(400).json({ error: true, message: 'Debes iniciar sesión' });
        
        // @ts-ignore
    if ( !session.user.isAdmin )
        return res.status(400).json({ error: true, message: 'Acceso denegado' }); 

    try {
        await db.connect();

        await Article.deleteOne({ _id });

        await db.disconnect();

        return res.status(200).json({ error: false, message: 'El artículo fue eliminado' });
    } catch( error ) {
        console.log( error );
        await db.disconnect();
        return res.status(500).json({ error: true, message: 'Ocurrió un error accediendo a la DB' });
    }

}