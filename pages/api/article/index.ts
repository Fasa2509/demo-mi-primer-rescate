import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { Article } from '../../../models';

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

const createArticle = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { title = '', fields = [] } = req.body;

    if ( !title || fields.length < 1 ) return res.status(400).json({ error: true, message: 'Faltan campos para crear el artículo' });

    try {
        await db.connect();
            
        const newArticle = new Article({ title, fields });
        await newArticle.save();

        await db.disconnect();
        
        return res.status(200).json({ error: false, message: '¡El artículo fue guardado!' });
    } catch( error ) {
        console.log( error );
        await db.disconnect();
        return res.status(400).json({ error: true, message: 'Ocurrió un error en la DB' });
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
        return res.status(400).json({ error: true, message: 'Ocurrió un error en la DB' });
    }

}