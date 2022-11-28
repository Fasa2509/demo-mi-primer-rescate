import type { NextApiRequest, NextApiResponse } from 'next'
import { isValidObjectId } from 'mongoose';
import { unstable_getServerSession } from 'next-auth';
import { nextAuthOptions } from '../auth/[...nextauth]';

import { db } from '../../../database';
import { PetType, PetTypeArray } from '../../../interfaces';
import { Pet } from '../../../models';

type Data =
| { error: boolean; message: string; };

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {

    switch( req.method ) {
        case 'POST':
            return createNewPet( req, res );

        case 'DELETE':
            return removePet( req, res );

        default:
            return res.status(200).json({ error: true, message: 'BAD REQUEST!' });
    }

}

const createNewPet = async ( req: NextApiRequest, res: NextApiResponse ) => {

    const { type = '', userId = '', name = '', images = [], description = '' } = req.body as { type: string; userId: string; name: string; images: string[]; description: string };

    const session = await unstable_getServerSession( req, res, nextAuthOptions );

    if ( !isValidObjectId( userId ) || !session || !session.user )
        return res.status(400).json({ error: true, message: 'La información del usuario no es válida' });

    if ( !PetTypeArray.includes( type as PetType ) || !name.trim() || !description.trim() )
        return res.status(400).json({ error: true, message: 'La información de la mascota no es válida' });

    if ( type === 'cambios' || type === 'experiencias' && images.length < 2 || images.length > 4 )
        return res.status(400).json({ error: true, message: 'La cantidad de imágenes no es válida' });
        
    if ( (type === 'perro' || type === 'gato' || type === 'otro') && images.length !== 1 )
        return res.status(400).json({ error: true, message: 'La cantidad de imágenes no es válida' });

    try {
        await db.connect();

        // @ts-ignore
        const newPet = new Pet({ type, userId, name, images, description, isAdminPet: session.user.role === 'admin' || session.user.role === 'superuser' });
        await newPet.save();

        await db.disconnect();

        return res.status(200).json({ error: false, message: 'La mascota fue guardada' });
    } catch( error ) {
        console.log( error );
        await db.disconnect();
        return res.status(400).json({ error: true, message: 'Ocurrió un error guardando la mascota' });
    }

}

const removePet = async ( req: NextApiRequest, res: NextApiResponse ) => {

    const { id = '' } = req.query;
    
    if ( !isValidObjectId( id ) ) return res.status(400).json({ error: true, message: 'El id de la mascota no es válido' });

    try {
        await db.connect();
        const pet = await Pet.findById( id );
        
        if ( !pet ) {
            await db.disconnect();
            return res.status(400).json({ error: true, message: 'No se encontró la mascota' });
        }

        pet.isAble = false;
        await pet.save();

        await db.disconnect();

        return res.status(200).json({ error: false, message: 'La mascota fue eliminada' });
    } catch( error ) {
        console.log( error );
        await db.disconnect();
        return res.status(400).json({ error: true, message: 'Ocurrió un error eliminando la mascota' });
    }

}