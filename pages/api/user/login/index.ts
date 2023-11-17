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

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return sendEmailPassword(req, res);

        case 'POST':
            return loginUser(req, res);

        case 'PUT':
            return changeUserPassword(req, res);

        default:
            return res.status(400).json({ error: true, message: 'BAD REQUEST' });
    }

}

const loginUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { email = '', password = '' } = req.body;

    if (!validations.isValidEmail(email) || !validations.isValidPassword(password))
        return res.status(400).json({ error: true, message: 'El correo o la contraseña no son válidos' });

    let user
    try {
        await db.connect()

        user = await User.findOne({ email, isAble: true });

    } catch (error) {
        console.log(error);
        await db.disconnect();
        return res.status(400).json({ error: true, message: 'Ocurrió un error iniciando sesión' });
    }
    await db.disconnect()

    if (!user) return res.status(400).json({ error: true, message: 'Correo o contraseña inválidos' });

    const match = await bcrypt.compare(password, user.password || '');

    if (!match) return res.status(400).json({ error: true, message: 'Correo o contraseña inválidos' });

    const { role, name, _id } = user;

    const token = jwt.signToken(_id, email)

    return res.status(200).json({
        token, // jwt
        user: {
            email,
            role,
            name
        }
    })
}

const sendEmailPassword = async (req: NextApiRequest, res: NextApiResponse) => {

    const { email = '' } = req.query;

    if (!validations.isValidEmail(email.toString())) return res.status(400).json({ error: true, message: 'El correo no es válido' });

    try {
        await db.connect();

        const user = await User.findOne({ email, isAble: true }).lean();

        await db.disconnect();

        if (!user) {
            return res.status(400).json({ error: true, message: 'No se encontró usuario con ese correo' });
        }

        const token = jwt.signToken(user._id, user.email).replaceAll('.', '___');

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
            from: '"Mi Primer Rescate" <miprimerrescate@gmail.com>', // sender address
            to: email.toString().toLowerCase(), // list of receivers
            subject: "MPR - Cambiar Contraseña", // Subject line
            html: `
            <head>
    <style>
        body {
            margin: 0;
            font-family: sans-serif;
            font-size: 16px;
        }

        .container {
            margin: 0;
            width: 100%;
            text-align: center;
        }

        .h1,
        .h2 {
            color: white;
            margin: 0;
            font-size: 2em;
            padding-left: 32px;
        }

        .h2 {
            font-size: 1.3em;
        }

        .header {
            width: 100%;
            background-color: #ff4f0d;
            background-image: linear-gradient(90deg, #ff4f0d 0%, #84efd4 100%);
            margin: 0;
            padding: 12px 0;
            text-align: left;
        }

        .sub-container {
            margin: 1em auto;
            width: 75%;
            text-align: center;
        }

        @media screen and (max-width: 480px) {
            .sub-container {
                width: 90%;
            }
        }

        .sub-container>* {
            margin: 20px auto;
        }

        .h3 {
            color: #66dabd;
            font-size: 1.6em;
            margin: 10px 0 0 0;
        }

        .p {
            text-align: justify;
            margin: 26px auto;
            color: #222;
        }

        .h4 {
            margin: 0;
            width: 100%;
            text-align: left;
            font-size: 20px;
            color: #66dabd
        }

        #button {
            background-color: #b74fd1;
            color: white;
            border-radius: 100px;
            font-size: 19px;
            padding: 4px 14px;
            border: none;
            text-decoration: none;
            transition: background-color 400ms ease;
        }

        #button:hover {
            background-color: #e54e18;
        }

        #button:visited,
        #button:link {
            color: white;
        }
    </style>
</head>

<body>
    <section class="container">
        <header class="header">
            <h1 class="h1">Mi Primer Rescate</h1>
            <h2 class="h2">Cambio de Contraseña</h2>
        </header>

        <div class="sub-container">
            <h3 class="h3">¡Hola ${user.name}!</h3>

            <p class="p">Hemos recibido una petición para cambiar la contraseña de tu cuenta de ${user.email} en la
                plataforma web de Mi Primer Rescate.</p>

            <p class="p">Por favor, haz click en el siguiente enlace para recuperar tu cuenta.</p>

            <a id="button" href='${process.env.NEXT_PUBLIC_DOMAIN_NAME}/auth/password/${token}' target='_blank'
                rel='noreferrer'>Ir a la página</a>
        </div>
    </section>
</body>`, // html body
        });

        return res.status(200).json({ error: false, message: 'El correo fue enviado' });
    } catch (error) {
        console.log(error);
        await db.disconnect();
        return res.status(400).json({ error: true, message: 'Ocurrió un error buscando el usuario' });
    }

}

const changeUserPassword = async (req: NextApiRequest, res: NextApiResponse) => {

    const { token = '', newPassword = '' } = req.body as { token: string; newPassword: string; };

    if (!token || token.length < 10)
        return res.status(400).json({ error: true, message: 'La información suministrada no es válida' });

    const decodedToken = await jwt.isValidEmailToken(token.toString().replaceAll('___', '.'));

    if (!decodedToken)
        return res.status(400).json({ error: true, message: 'La información suministrada no es válida' });

    if (!validations.isValidPassword(newPassword))
        return res.status(400).json({ error: true, message: 'La nueva clave no es válida' });

    try {
        await db.connect();

        const user = await User.findById(decodedToken._id);

        if (!user) {
            await db.disconnect();
            return res.status(400).json({ error: true, message: 'No se encontró el usuario' });
        }

        const salt = await bcrypt.genSalt(10);
        const userPassword = await bcrypt.hash(newPassword, salt);

        user.password = userPassword;
        await user.save();

        await db.disconnect();

        return res.status(200).json({ error: false, message: 'La clave fue actualizada' });
    } catch (error) {
        console.log(error);
        await db.disconnect();
        return res.status(400).json({ error: true, message: 'Ocurrió un error buscando el usuario' });
    }

}