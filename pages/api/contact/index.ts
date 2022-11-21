import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { User } from '../../../models';
import { isValidEmail } from '../../../utils/validations';

type Data =
| { error: boolean; message: string; }

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch( req.method ) {
        case 'POST':
            return getUserByEmail( req, res );

        default:
            return res.status(400).json({ error: true, message: 'BAD REQUEST'});
    }

}

const getUserByEmail = async ( req: NextApiRequest, res: NextApiResponse ) => {

    const { email = '', subscribe = 'true' } = req.body;

    if ( !email ) return res.status(400).json({ error: true, message: 'Falta el email' });
    
    if ( !isValidEmail( email ) ) return res.status(400).json({ error: true, message: 'El correo no es válido' })
    
    try {
        await db.connect();
        
        const user = await User.findOne({ email: req.body.email });
        
        if ( !user ) {
            await db.disconnect();
            return res.status(400).json({ error: true, message: 'No existe un usuario con ese correo' });
        }

        user.isSubscribed = subscribe === 'true';

        await user.save();
        
        await db.disconnect();

        return res.status(200).json({ error: false, message: subscribe === 'true' ? '¡Ahora estás suscrit@ a MPR!' : 'Ya no estás suscrit@ a MPR' });
    } catch( error ) {
        console.log( error );
        await db.disconnect();
        return res.status(500).json({ error: true, message: 'Ocurrió un error en la DB' });
    }

}