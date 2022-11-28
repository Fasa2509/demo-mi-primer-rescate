import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';

import { db } from '../../../../database';
import { User } from '../../../../models';
import { jwt, validations } from '../../../../utils';

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

    if ( !email || !password || !name || typeof email !== 'string' || typeof name !== 'string' || typeof password !== 'string' )
        return res.status(400).json({ error: true, message: 'La información está incompleta' });
    
    if ( name.length < 2 )
        return res.status(400).json({ error: true, message: 'El nombre debe tener al menos 2 caracteres' });
    
    if ( !(new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})").test( password )) )
        return res.status(400).json({ error: true, message: 'La contraseña debe cumplir con los requisitos' });

    if ( !validations.isValidEmail( email ) )
        return res.status(400).json({ error: true, message: 'El correo utilizado no es válido' });

    await db.connect();
    
    const user = await User.findOne({ email: email.toLowerCase() });

    if ( user ) {
        await db.disconnect();
        return res.status(400).json({ error: true, message: 'El correo ya está en uso' });
    };

    let newUser;
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        newUser = new User({
            email: email.toLocaleLowerCase(),
            name: name.trim(),
            password: hash,
            isSubscribed,
            role: 'admin',
            isAble: false,
        });

        await newUser.save({ validateBeforeSave: true });

        const token = jwt.signToken( newUser._id, newUser.email ).replaceAll('.', '___');

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
              user: process.env.MAILER__USER,
              pass: process.env.MAILER__PASS,
            },
        });

        let info = await transporter.sendMail({
            from: '"Mi Primer Rescate 👻" <miprimerrescate@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "MPR - Activar Cuenta ✔", // Subject line
            html: `
            <h1>Mi Primer Rescate</h1>
            <p>¡Gracias por unirte a nuestra fundación! 🥳🐶🐱</p>
            <br />
            <p>Por favor haz click en el siguiente enlace para activar tu cuenta de MPR.</p>
            <br />
            <a href='${ process.env.NEXTAUTH_URL }/auth/register/${ token }' target='_blank' rel='noreferrer'>Activar cuenta MPR</a>
            `, // html body
        });
    } catch( error ) {
        console.log(error);
        await db.disconnect();
        return res.status(500).json({ error: true, message: 'Ocurrió un error creando el usuario' });
    }

    await db.disconnect();

    // const { role, _id } = newUser;

    // const token = jwt.signToken( _id, email );

    return res.status(200).json({
        // token, // jwt
        // user: {
        //     email,
        //     role,
        //     name,
        // }
        error: false,
        message: 'Enviamos un mail a la dirección registrada, por favor verifica tu cuenta'
    })
}
