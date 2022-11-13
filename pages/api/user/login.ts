import type { NextApiRequest, NextApiResponse } from 'next'

import bcrypt from 'bcryptjs';

import { db } from '../../../database'
import { User } from '../../../models'
import { jwt } from '../../../utils';

type Data =
| { error: boolean, message: string }
| {
    token: string;
    user: {
        email: string;
        name: string;
        role: string;
    }
}

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch( req.method ) {
        case 'POST':
            return loginUser( req, res )
    
        default:
            return res.status(400).json({ error: true, message: 'BAD REQUEST' })
    }

}

const loginUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { email = '', password = '' } = req.body;

    let user
    try {
        await db.connect()
    
        user = await User.findOne({ email });
    
    } catch( error ) {
        console.log(error);
        await db.disconnect();
        return res.status(400).json({ error: true, message: 'Ocurrió un error iniciando sesión' });
    }
    await db.disconnect()

    if ( !user ) return res.status(400).json({ error: true, message: 'Correo o contraseña inválidos' });

    const match = await bcrypt.compare( password, user.password || '' );

    if ( !match ) return res.status(400).json({ error: true, message: 'Correo o contraseña inválidos' });

    const { role, name, _id } = user;

    const token = jwt.signToken( _id, email )

    return res.status(200).json({
        token, // jwt
        user: {
            email,
            role,
            name
        }
    })
}
