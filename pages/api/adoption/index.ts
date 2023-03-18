import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from "next-auth/next";
import { nextAuthOptions } from '../auth/[...nextauth]';
import { isValidObjectId } from 'mongoose';
import { db } from '../../../database';
import { Adoption } from '../../../models';

type Data =
| { error: boolean; message: string; }

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch( req.method ) {
        case 'POST':
            return createAdoption( req, res );

        case 'PUT':
            return checkAdoption( req, res );

        default:
            return res.status(400).json({ error: true, message: 'BAD REQUEST' });
    }

}

const createAdoption = async ( req: NextApiRequest, res: NextApiResponse ) => {

    const session = await unstable_getServerSession( req, res, nextAuthOptions );

    if ( !session || !session.user )
        return res.status(400).json({ error: true, message: 'Debes iniciar sesión' });

    try {
        await db.connect();

        // @ts-ignore
        const adoption = new Adoption({ ...req.body, user: session.user._id });
        await adoption.save();

        await db.disconnect();

        return res.status(200).json({ error: false, message: 'La petición de adopción fue creada' });
    } catch( error ) {
        console.log( error );
        await db.disconnect();
        return res.status(500).json({ error: true, message: 'Ocurrió un error en la DB' });
    }

}

const checkAdoption = async ( req: NextApiRequest, res: NextApiResponse ) => {

    const { _id } = req.body;

    if ( !_id || !isValidObjectId( _id ) )
        return res.status(400).json({ error: true, message: 'El id no es válido' });

    const session = await unstable_getServerSession( req, res, nextAuthOptions );

    const validRoles = ['superuser', 'admin'];

    // @ts-ignore
    if ( !session || !session.user || !validRoles.includes( session.user.role ) )
        return res.status(400).json({ error: true, message: 'Acceso denegado' });

    try {
        await db.connect();

        const adoption = await Adoption.findById( _id );

        if ( !adoption ) {
            await db.disconnect();
            return res.status(400).json({ error: true, message: 'No se encontró la petición' });
        }

        adoption.checked = true;
        await adoption.save();

        await db.disconnect();

        return res.status(200).json({ error: false, message: 'La petición fue actualizada' });
    } catch( error ) {
        console.log( error );
        await db.disconnect();
        return res.status(400).json({ error: true, message: 'Ócurrio un error accediendo a la DB' });
    }

}