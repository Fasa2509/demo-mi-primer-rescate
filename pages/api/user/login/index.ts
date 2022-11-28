import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';

import { db } from '../../../../database';
import { User } from '../../../../models';
import { jwt, validations } from '../../../../utils';
import { isValidObjectId } from 'mongoose';

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
        case 'GET':
            return sendEmailPassword( req, res );

        case 'POST':
            return loginUser( req, res );
            
        case 'PUT':
            return changeUserPassword( req, res );
    
        default:
            return res.status(400).json({ error: true, message: 'BAD REQUEST' });
    }

}

const loginUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { email = '', password = '' } = req.body;

    if ( !validations.isValidEmail( email ) /*|| !(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!_@#\$%\^&\*])(?=.{8,})").test( password )) */ )
        return res.status(400).json({ error: true, message: 'El correo o la contraseña no son válidos' });

    let user
    try {
        await db.connect()
    
        user = await User.findOne({ email, isAble: true });
    
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

const sendEmailPassword = async ( req: NextApiRequest, res: NextApiResponse ) => {

    const { email = '' } = req.query;
    
    if ( !validations.isValidEmail( email.toString() ) ) return res.status(400).json({ error: true, message: 'El correo no es válido' });

    try {
        await db.connect();

        const user = await User.findOne({ email, isAble: true });

        if ( !user ) {
            await db.disconnect();
            return res.status(400).json({ error: true, message: 'No se encontró usuario con ese correo' });
        }

        const token = jwt.signToken( user._id, user.email ).replaceAll('.', '___');
        
        // TODO: enviar correo electronico con el token que lleva userId y correo
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
            to: email.toString().toLowerCase(), // list of receivers
            subject: "MPR - Cambiar Contraseña ✔", // Subject line
            html: `
            <h1>Mi Primer Rescate</h1>
            <p>Hubo una petición para cambiar la contraseña de tu cuenta en la página de MPR. Por favor, haz click en el siguiente enlace.</p>
            <br />
            <a href='${ process.env.NEXTAUTH_URL }/auth/password/${ token }' target='_blank' rel='noreferrer'>Ir a la página</a>
            `, // html body
        });
        
        await db.disconnect();

        return res.status(200).json({ error: false, message: 'El correo fue enviado' });
    } catch( error ) {
        console.log( error );
        await db.disconnect();
        return res.status(400).json({ error: true, message: 'Ocurrió un error buscando el usuario' });
    }

}

const changeUserPassword = async ( req: NextApiRequest, res: NextApiResponse ) => {

    const { id = '', newPassword = '' } = req.body as { id: string; newPassword: string; };

    if ( !isValidObjectId( id ) )
        return res.status(400).json({ error: true, message: 'La información suministrada no es válida' });
        
    // if ( !validations.isValidPassword( newPassword ) )
    //     return res.status(400).json({ error: true, message: 'La nueva clave no es válida' });

    try {
        await db.connect();

        const user = await User.findById( id );

        if ( !user ) {
            await db.disconnect();
            return res.status(400).json({ error: true, message: 'No se encontró el usuario' });
        }

        const salt = await bcrypt.genSalt( 10 );
        const userPassword = await bcrypt.hash(newPassword, salt);

        user.password = userPassword;
        await user.save();

        await db.disconnect();

        return res.status(200).json({ error: false, message: 'La clave fue actualizada' });
    } catch( error ) {
        console.log( error );
        await db.disconnect();
        return res.status(400).json({ error: true, message: 'Ocurrió un error buscando el usuario' });
    }

}