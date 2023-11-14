import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '../auth/[...nextauth]';
import nodemailer from 'nodemailer';
import { db } from '../../../database';
import { Article, User } from '../../../models';

type Data =
    | { error: boolean; message: string; }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getMoreArticles(req, res);

        case 'POST':
            return createArticle(req, res);

        default:
            return res.status(400).json({ error: true, message: 'BAD REQUEST' });
    }

}

const getMoreArticles = async (req: NextApiRequest, res: NextApiResponse) => {

    let { seconds = 0 } = req.query;

    seconds = Number(seconds.toString());

    try {
        await db.connect();

        const articles = await Article.find({ createdAt: { $lt: seconds } }).sort({ createdAt: -1 }).limit(5);

        await db.disconnect();

        return res.status(200).json(articles);
    } catch (error) {
        console.log(error);
        await db.disconnect();
        return res.status(400).json({ error: true, message: 'Ocurrió un error buscando los artículos' });
    }

}

const createArticle = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { title = '', fields = [] } = req.body;

    const session = await getServerSession(req, res, nextAuthOptions);

    if (!session || !session.user)
        return res.status(400).json({ error: true, message: 'Debes iniciar sesión' });

    const validRoles = ['superuser', 'admin'];

    // @ts-ignore
    if (!validRoles.includes(session.user.role))
        return res.status(400).json({ error: true, message: 'Acceso denegado' });

    if (!title || fields.length < 1) return res.status(400).json({ error: true, message: 'Faltan campos para crear el artículo' });

    try {
        await db.connect();

        const newArticle = new Article({ title, fields });
        await newArticle.save();

        const usersInfo: { name: string; email: string }[] = await User
            .find({ isSubscribed: true })
            .select('-_id name email')
            .lean();

        await db.disconnect();

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.MAILER__USER,
                pass: process.env.MAILER__PASS,
            },
            tls: {
                rejectUnauthorized: false,
            }
        });

        await transporter.sendMail({
            from: '"Mi Primer Rescate" <miprimerrescate@gmail.com>', // sender address
            to: usersInfo.map((i) => i.email), // list of receivers
            subject: "MPR - ¡Novedades!", // Subject line
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
            background-image: linear-gradient(90deg, #ff4f0d 0%, #84efd4 100%);
            background-color: #ff4f0d;
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
            color: #9e39b8;
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
            text-align: center;
            font-size: 22px;
            color: #9e39b8
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
            background-color: #ff4f0d;
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
            <h2 class="h2">¡Novedades!</h2>
        </header>

        <div class="sub-container">
            <h4 class="h4">¡Hola! Hay novedades en nuestra página, ¡ven a verlas ya! 🐱🐶</h4>

            <p class="p">Acabamos de publicar un nuevo artículo, ${title}, para mantenerte al día sobre lo que hacemos
                en
                nuestra fundación, no te lo pierdas.</p>

            <p class="p">En Mi Primer Rescate estamos al día en busca de nuevas aventuras, y tú puedes enterarte de la
                última ahora.</p>

            <div>
                <a id="button" href='${process.env.NEXT_PUBLIC_DOMAIN_NAME}/' target='_blank' rel='noreferrer'>¡Ven a
                    ver!</a>
            </div>
        </div>
    </section>
</body>
        `, // html body
        });

        return res.status(200).json({ error: false, message: '¡El artículo fue guardado!' });
    } catch (error) {
        console.log(error);
        await db.disconnect();
        return res.status(400).json({ error: true, message: 'Ocurrió un error en la DB' });
    }
}