import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { Adoption } from '../../../models';

type Data =
| { error: boolean; message: string; }

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch( req.method ) {
        case 'POST':
            return createAdoption( req, res );

        default:
            return res.status(400).json({ error: true, message: 'BAD REQUEST' });
    }

}

const createAdoption = async ( req: NextApiRequest, res: NextApiResponse ) => {

    // const { form } = req.body;
    // console.log( req.body );

    try {
        await db.connect();

        const adoption = new Adoption( req.body );
        await adoption.save();

        await db.disconnect();

        return res.status(200).json({ error: false, message: 'La petición de adopción fue creada' });
    } catch( error ) {
        console.log( error );
        await db.disconnect();
        return res.status(500).json({ error: true, message: 'Ocurrió un error en la DB' });
    }

}