import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '../auth/[...nextauth]';
import { isValidObjectId } from 'mongoose';
import { db } from '../../../database';
import { User } from '../../../models';
import { Role } from '../../../interfaces';

type Data =
| { error: boolean; message: string }

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {

    switch( req.method ) {
        case 'PUT':
            return updateUser( req, res );
            
        case 'DELETE':
            return deleteUser( req, res );

        default:
            return res.status(400).json({ error: true, message: 'BAD REQUEST' })
    }

}

const updateUser = async ( req: NextApiRequest, res: NextApiResponse ) => {

    const { id = '', role = '' } = req.query;

    if ( !id || !isValidObjectId( id ) || !role.toString() ) return res.status(400).json({ error: true, message: 'La información está incompleta' });

    const validRoles = ['user', 'superuser', 'admin'];

    if ( !validRoles.includes( role.toString() ) ) return res.status(400).json({ error: true, message: 'El rol no es válido' });

    try {
        const session = await getServerSession( req, res, nextAuthOptions );

        // @ts-ignore
        if ( !session || session?.user.role !== 'admin' ) return res.status(400).json({ error: true, message: 'No tienes permiso para actualizar un usuario' });

        await db.connect();
        
        const user = await User.findById( id );

        if ( !user ) {
            await db.disconnect();
            return res.status(400).json({ error: true, message: 'No hay usuario con ese id' });
        }

        user.role = role.toString() as Role;
        await user.save();
        
        await db.disconnect();

        return res.status(200).json({ error: false, message: 'El usuario fue actualizado' });
    } catch( error ) {
        console.log( error );
        await db.disconnect();
        return res.status(500).json({ error: true, message: 'Error actualizando el usuario' });
    }

}

const deleteUser = async ( req: NextApiRequest, res: NextApiResponse ) => {

    const { id = '', enable } = req.query;

    const validEnables = ['true', 'false'];

    if ( typeof enable === 'undefined' || !validEnables.includes( enable?.toString() ) ) return res.status(400).json({ error: true, message: 'La habilitación no es válida' });
    if ( !id || !isValidObjectId( id ) ) return res.status(400).json({ error: true, message: 'El id no es válido' });

    try {
        const session = await getServerSession( req, res, nextAuthOptions );

        // @ts-ignore
        if ( !session || session?.user.role !== 'admin' ) return res.status(400).json({ error: true, message: 'No tienes permiso para eliminar un usuario' });

        await db.connect();

        const user = await User.findById( id );

        if ( !user ) {
            await db.disconnect();
            return res.status(400).json({ error: true, message: 'No hay usuario con ese id' });
        }

        // @ts-ignore
        user.isAble = Boolean( enable );
        await user.save();

        await db.disconnect();

        return res.status(200).json({ error: false, message: `El usuario fue ${ enable ? 'habilitado' : 'eliminado' }` });
    } catch( error ) {
        console.log( error );
        await db.disconnect();
        return res.status(500).json({ error: true, message: 'Ocurrió un error eliminando el usuario' });
    }

}