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
        case 'POST':
            return registerUser(req, res);

        default:
            return res.status(400).json({ error: true, message: 'BAD REQUEST' })
    }

}

const registerUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { name = '', email = '', password = '', isSubscribed = false } = req.body as { name: string, email: string, password: string, isSubscribed: boolean };

    if (!email || !password || !name || typeof email !== 'string' || typeof name !== 'string' || typeof password !== 'string')
        return res.status(400).json({ error: true, message: 'La información está incompleta' });

    if (name.length < 2)
        return res.status(400).json({ error: true, message: 'El nombre debe tener al menos 2 caracteres' });

    if (!validations.isValidPassword(password))
        return res.status(400).json({ error: true, message: 'La contraseña debe cumplir con los requisitos' });

    if (!validations.isValidEmail(email))
        return res.status(400).json({ error: true, message: 'El correo utilizado no es válido' });

    await db.connect();

    const user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
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
            role: 'user',
            isAble: false,
        });

        await newUser.save({ validateBeforeSave: true });

        await db.disconnect();

        const token = jwt.signToken(newUser._id, newUser.email).replaceAll('.', '___');

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
            to: email, // list of receivers
            subject: "MPR - Activar Cuenta", // Subject line
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

        .img-container {
            width: clamp(110px, 100%, 250px);
            text-align: center;
        }

        .img {
            width: 50%;
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
            color: #B74FD1;
        }

        #button {
            background-color: #ff4f0d;
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
            <h2 class="h2">Creación de Usuario</h2>
        </header>

        <div class="sub-container">
            <div class="img-container">
                <img class="img" src="${process.env.NEXT_PUBLIC_DOMAIN_NAME}/Logo-MPR.png" alt="Logo MPR">

                <h3 class="h3">¡Hola ${newUser.name.split(' ')[0]}!</h3>
            </div>

            <p class="p">¡Gracias por unirte a la manada! 🥳🐶🐱</p>

            <p class="p">Mi Primer Rescate te da la bienvenida a su plataforma web, donde podrás encontrar información
                actualizada al momento y apoyar a la fundación, bien sea aportando con una donación o comprando en
                nuestra <a href="miprimerrescate.org" target="_blank" rel="noreferrer">tienda virtual</a>.
            </p>

            <h4 class="h4">¡Visita constantemente nuestra web para enterarte de todo! Gracias por contar con nosotros.
            </h4>

            <p class="p">Por favor haz click en el siguiente enlace para activar tu cuenta de MPR.</p>

            <div>
                <a id="button" href="${process.env.NEXT_PUBLIC_DOMAIN_NAME}/auth/register/${token}" target="_blank"
                    rel="noreferrer">
                    Verificar Cuenta
                </a>
            </div>

        </div>
    </section>
</body>`, // html body
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: true, message: 'Ocurrió un error creando el usuario' });
    }

    return res.status(200).json({
        error: false,
        message: 'Enviamos un correo a la dirección registrada, por favor revisa tu cuenta',
    })
}
