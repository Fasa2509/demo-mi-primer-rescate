import type { NextApiRequest, NextApiResponse } from 'next'
import { isValidObjectId } from 'mongoose';
import { unstable_getServerSession } from 'next-auth';
import { nextAuthOptions } from '../auth/[...nextauth]';

import { db } from '../../../database';
import { PetType, PetTypeArray } from '../../../interfaces';
import { Pet, User } from '../../../models';
import { formatText } from '../../../utils';

type Data =
| { error: boolean; message: string; };

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {

    switch( req.method ) {
        case 'GET':
            return getMorePets( req, res );

        case 'POST':
            return createNewPet( req, res );

        case 'PUT':
            return updatePetDescription( req, res );

        case 'DELETE':
            return updatePetAbility( req, res );

        default:
            return res.status(200).json({ error: true, message: 'BAD REQUEST!' });
    }

}

const getMorePets = async ( req: NextApiRequest, res: NextApiResponse ) => {

    let { date = 0, admin = '', type = '' } = req.query;

    if ( !PetTypeArray.includes( type as PetType ) )
        return res.status(400).json({ error: true, message: 'La información de la mascota no es válida' });

    if ( !date || isNaN( Number(date) ) || Number( date ) < 1662023660970 )
        return res.status(400).json({ error: true, message: 'La fecha no es válida' });

    // @ts-ignore
    admin = admin === 'true';

    try {
        await db.connect();
        
        const pets = await Pet
            .find({ type, isAble: true, isAdminPet: admin, createdAt: { $lt: Number( date ) } })
            .sort({ createdAt: -1 })
            .limit( 6 );

        await db.disconnect();

        return res.status(200).json( pets );
    } catch( error ) {
        console.log( error );
        await db.disconnect();
        return res.status(400).json({ error: true, message: 'Ocurrió un error buscando más mascotas' });
    }

}


const createNewPet = async ( req: NextApiRequest, res: NextApiResponse ) => {

    const { type = '', name = '', images = [], description = '' } = req.body as { type: string; name: string; images: string[]; description: string };

    const session = await unstable_getServerSession( req, res, nextAuthOptions );

    if ( !session || !session.user )
        return res.status(400).json({ error: true, message: 'Debes iniciar sesión' });

    if ( !PetTypeArray.includes( type as PetType ) || name.trim().length < 2 || description.trim().length < 5 )
        return res.status(400).json({ error: true, message: 'La información de la mascota no es válida' });

    if ( (type === 'cambios' || type === 'experiencias') && (images.length < 2 || images.length > 4) )
        return res.status(400).json({ error: true, message: 'La cantidad de imágenes no es válida' });

    if ( (type === 'perro' || type === 'gato' || type === 'otro') && images.length !== 1 )
        return res.status(400).json({ error: true, message: 'La cantidad de imágenes no es válida' });

    try {
        await db.connect();
        
        // @ts-ignore
        const user = await User.findById( session.user._id );

        if ( !user ) {
            await db.disconnect();
            return res.status(400).json({ error: true, message: 'No se guardó la mascota correctamente' });
        }

        const newPet = new Pet({
            type,
            // @ts-ignore
            userId: session.user._id,
            name: formatText( name.trim() ),
            images,
            description: description.trim(),
            // @ts-ignore
            isAdminPet: session.user.role === 'admin' || session.user.role === 'superuser'
        });
        await newPet.save();

        user.pets = [...user?.pets, newPet._id];
        await user.save();

        await db.disconnect();

        return res.status(200).json({ error: false, message: '¡La mascota fue publicada!' });
    } catch( error ) {
        console.log( error );
        await db.disconnect();
        return res.status(400).json({ error: true, message: 'Ocurrió un error guardando la mascota' });
    }

}


const updatePetDescription = async ( req: NextApiRequest, res: NextApiResponse ) => {

    const { petId = '', petDescription = '' } = req.body;

    if ( !petId || !petDescription.trim() ) return res.status(400).json({ error: true, message: 'La información está incompleta' });

    if ( !isValidObjectId( petId ) ) return res.status(400).json({ error: true, message: 'La información es inválida' });

    // @ts-ignore
    const { user } = await unstable_getServerSession(req, res, nextAuthOptions);

    if ( !user ) return res.status(400).json({ error: true, message: 'Debes iniciar sesión' });

    try {
        await db.connect();

        const pet = await Pet.findById( petId );
        
        if ( !pet || pet.userId.toString() !== user._id ) {
            await db.disconnect();
            return res.status(400).json({ error: true, message: 'No se pudo actualizar la mascota' });
        }

        pet.description = petDescription.trim();
        await pet.save();

        await db.disconnect();

        return res.status(200).json({ error: false, message: 'La mascota fue actualizada' });
    } catch( error ) {
        console.log( error );
        await db.disconnect();
        return res.status(400).json({ error: true, message: 'Ocurrió un error actualizando la mascota' });
    }

}


const updatePetAbility = async ( req: NextApiRequest, res: NextApiResponse ) => {

    const { id = '' } = req.query;
    
    if ( !isValidObjectId( id ) ) return res.status(400).json({ error: true, message: 'El id de la mascota no es válido' });

    const session = await unstable_getServerSession( req, res, nextAuthOptions );

    if ( !session || !session.user )
        return res.status(400).json({ error: true, message: 'No tienes permiso para eliminar esa mascota' });

    try {
        await db.connect();
        const pet = await Pet.findById( id );
        
        if ( !pet ) {
            await db.disconnect();
            return res.status(400).json({ error: true, message: 'No se encontró la mascota' });
        }

        const adminRoles = ['admin', 'superuser'];

        // @ts-ignore
        if ( pet.userId.toString() !== session.user._id && !adminRoles.includes( session.user.role ) ) {
            await db.disconnect();
            return res.status(400).json({ error: true, message: 'No se encontró la mascota' });
        }

        pet.isAble = !pet.isAble;
        await pet.save();

        await db.disconnect();

        return res.status(200).json({ error: false, message: `La mascota ${ pet.isAble ? 'ahora' : 'ya no' } es pública` });
    } catch( error ) {
        console.log( error );
        await db.disconnect();
        return res.status(400).json({ error: true, message: 'Ocurrió un error eliminando la mascota' });
    }

}