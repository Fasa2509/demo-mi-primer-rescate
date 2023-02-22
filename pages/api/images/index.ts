import { isValidObjectId } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { IndexImage } from '../../../models';

type Data =
| { error: boolean; message: string; }

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch( req.method ) {
        case 'POST':
            return saveIndexImage( req, res );

        case 'DELETE':
            return deleteIndexImage( req, res );

        default:
            return res.status(400).json({ error: true, message: 'BAD REQUEST!' });
    }

}


const saveIndexImage = async ( req: NextApiRequest, res: NextApiResponse) => {

    const { newImages } = req.body as { newImages: Array<{ imgName: string; imgUrl: string }> };

    if ( newImages.some(( img ) => !img.imgName || !img.imgUrl || typeof img.imgName !== 'string' || typeof img.imgUrl !== 'string') )
        return res.status(400).json({ error: true, message: 'Falta información de algunas imágenes' });

    try {
        await db.connect();

        await IndexImage.deleteMany({});

        await IndexImage.insertMany( newImages.map(( img ) => ({ url: img.imgUrl, alt: img.imgName })) );

        await db.disconnect();

        return res.status(200).json({ error: false, message: '¡Las imágenes fueron guardadas!' });
    } catch( error ) {
        console.log( error );
        await db.disconnect();
        return res.status(500).json({ error: true, message: 'Ocurrió un error guardando la imagen en la DB' });
    }

}


const deleteIndexImage = async ( req: NextApiRequest, res: NextApiResponse ) => {

    const { id } = req.query;

    if ( !isValidObjectId( id ) ) return res.status(400).json({ error: true, message: 'El id de la imagen no es válido' });

    try {
        await db.connect();
        
        await IndexImage.findByIdAndRemove( id );

        await db.disconnect();

        return res.status(200).json({ error: false, message: 'La imagen fue eliminada' });
    } catch( error ) {
        await db.disconnect();
        
        return res.status(500).json({ error: true, message: 'Ocurrió un error eliminando la imagen' });
    }

}