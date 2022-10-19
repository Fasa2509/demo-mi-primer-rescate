import type { NextApiRequest, NextApiResponse } from 'next'

import bcrypt from 'bcryptjs';

import { db } from '../../../database'
import { User } from '../../../models'
import { jwt, validations } from '../../../utils';

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
            return registerUser( req, res );
    
        default:
            return res.status(400).json({ error: true, message: 'BAD REQUEST' })
    }

}

const registerUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { name = '', email = '', password = '', isSubscribed = false } = req.body as { name: string, email: string, password: string, isSubscribed: boolean };

    if ( !email || !password || !name ) return res.status(400).json({ error: true, message: 'La información está incompleta' });

    if ( password.length < 4 ) {
        return res.status(400).json({ error: true, message: 'La contraseña debe tener mas de 4 caracteres' });
    }

    if ( name.length < 3 ) {
        return res.status(400).json({ error: true, message: 'El nombre debe tener al menos 3 caracteres' });
    }

    if ( !validations.isValidEmail( email ) ) {
        return res.status(400).json({
            error: true,
            message: 'El correo utilizado no es válido',
        })
    }

    await db.connect();
    const user = await User.findOne({ email });

    if ( user ) return res.status(400).json({ error: true, message: 'El correo ya está en uso' });

    let newUser;
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        newUser = new User({
            email: email.toLocaleLowerCase(),
            name,
            password: hash,
            isSubscribed,
            role: 'admin',
            isAble: true,
        });

        await newUser.save({ validateBeforeSave: true });
    } catch( error ) {
        console.log(error);
        await db.disconnect();
        return res.status(500).json({ error: true, message: 'Ocurrió un error creando el usuario' });
    }

    await db.disconnect();

    const { role, _id } = newUser;

    const token = jwt.signToken( _id, email );

    return res.status(200).json({
        token, // jwt
        user: {
            email,
            role,
            name,
        }
    })
}
