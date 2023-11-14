import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '../auth/[...nextauth]';
import nodemailer from 'nodemailer';

import { Product, User } from '../../../models';
import { db } from '../../../database';

type Data =
    | { error: boolean; message: string; }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return applyDiscountToProducts(req, res);

        default:
            return res.status(400).json({ error: true, message: 'BAD REQUEST' });
    }

}

const applyDiscountToProducts = async (req: NextApiRequest, res: NextApiResponse) => {

    let { discount = -1, matcher = '' } = req.query;
    discount = Number(discount);
    matcher = matcher.toString();

    if (isNaN(discount) || discount < 0 || discount > 50) return res.status(400).json({ error: true, message: 'El descuento no es válido' });

    discount /= 100;

    const validTags = ['accesorios', 'consumibles', 'ropa', 'útil', 'todos'];

    const session = await getServerSession(req, res, nextAuthOptions);

    if (!session || !session.user)
        return res.status(400).json({ error: true, message: 'Debes iniciar sesión' });

    const validRoles = ['superuser', 'admin'];

    // @ts-ignore
    if (!validRoles.includes(session.user.role))
        return res.status(400).json({ error: true, message: 'Acceso denegado' });

    try {
        await db.connect();

        if (validTags.includes(matcher)) {
            (matcher === 'todos')
                ? await Product.updateMany({}, { $set: { discount } })
                : await Product.updateMany({ tags: matcher }, { $set: { discount } });
        } else {
            matcher = matcher.toLocaleLowerCase();
            const product = await Product.findOne({ slug: matcher });

            if (!product) {
                await db.disconnect();
                return res.status(400).json({ error: true, message: 'No se encontró el producto' });
            }

            product.discount = discount;
            await product.save();
        }

        const usersInfo: { name: string; email: string }[] = await User
            .find({ isSubscribed: true })
            .select('email name -_id')
            .lean();

        await db.disconnect();

        if (validTags.includes(matcher)) {
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

            const objectDiscount = {
                accesorios: 'de accesorios',
                consumibles: 'consumibles',
                ropa: 'de ropa',
                útil: 'útiles',
            }

            let infoDiscount = (matcher === 'todos')
                ? 'para todos nuestros productos'
                // @ts-ignore
                : `para nuestros productos ${objectDiscount[matcher]}`;

            let info = await transporter.sendMail({
                from: '"Mi Primer Rescate" <miprimerrescate@gmail.com>', // sender address
                to: usersInfo.map((i) => i.email), // list of receivers
                subject: "MPR - ¡Descuentos!", // Subject line
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
            text-align: left;
            font-size: 20px;
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
            <h2 class="h2">¡Descuentos!</h2>
        </header>

        <div class="sub-container">
            <div class="img-container">
                <img class="img" src="${process.env.NEXT_PUBLIC_DOMAIN_NAME}/Logo-MPR.png" alt="Logo MPR">

                <h3 class="h3">¡Hola!</h3>
            </div>

            <p class="p">¡Hay descuentos en nuestra tienda virtual! 🛍️🐱🐶</p>

            <p class="p">Hey, tenemos nuevos descuentos en nuestra tienda ${infoDiscount}, no pierdas la oportunidad de
                consentir aún más a tus mascotas.</p>

            <p class="p">¡Devuélveles el amor que ell@s te dan con un regalo espectacular! Con
                cada
                compra estarás apoyando a la fundación.</p>


            <h4 class="h4">Visita nuestra tienda virtual y entérate de las novedades, ¡pero ven antes de que se acabe!
            </h4>

            <div>
                <a id="button" href="${process.env.NEXT_PUBLIC_DOMAIN_NAME}/tienda" target="_blank" rel="noreferrer">
                    Ir a la Tienda
                </a>
            </div>

        </div>
    </section>
</body>
                `, // html body
            });
        }

        return res.status(200).json({ error: false, message: 'El descuento fue aplicado' });
    } catch (error) {
        console.log(error);
        await db.disconnect();
        return res.status(500).json({ error: true, message: 'Ocurrió un error en la DB' });
    }

}