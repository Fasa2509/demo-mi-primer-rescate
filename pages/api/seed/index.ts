import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { db } from '../../../database';
import { allProducts, adoptionPets, otherPets } from '../../../interfaces';
import { Pet, Product, User } from '../../../models';
import { nextAuthOptions } from '../auth/[...nextauth]';

type Data =
    | { error: boolean; message: string }

const validSeeds = [
    'products',
    'pets',
    'users',
]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    if (req.method !== 'GET') return res.status(400).json({ error: true, message: "BAD REQUEST" });
    // if (!req.query.data) return res.status(400).json({ error: true, message: 'Debes indicar lo que vas a cargar a la DB' });
    if (!validSeeds.includes(req.query.data!.toString())) return res.status(400).json({ error: true, message: 'Esa query no existe' });

    if (req.query.data) return updateProducts(req, res);

    return res.status(201).json({ error: false, message: 'No hay data' })

}

const updateProducts = async (req: NextApiRequest, res: NextApiResponse) => {

    const { data } = req.query;

    const session = await getServerSession(req, res, nextAuthOptions);

    // if ((!session || !session.user) && data )
    //     return res.status(400).json({ error: true, message: 'Debes iniciar sesión' });

    const validRoles = ['superuser', 'admin'];

    if ((!session || !session.user || !validRoles.includes(session.user.role!)) && data !== 'users')
        return res.status(400).json({ error: true, message: 'Acceso denegado' });

    try {
        await db.connect();

        if (data === 'products') {
            await Product.deleteMany();

            const actualProducts = allProducts.map((product) => {
                let { _id, ...p } = product;
                return p;
            });

            await Product.insertMany(actualProducts);

            await db.disconnect();

            return res.status(200).json({ error: false, message: 'Los productos fueron cargados' });
        }

        if (data === 'pets') {
            await Pet.deleteMany();

            const actualPets = adoptionPets.map((pet) => {
                let { _id, ...p } = pet;
                return p;
            });

            const morePets = otherPets.map((pet) => {
                let { _id, ...p } = pet;
                return p;
            });

            await Pet.insertMany([...actualPets, ...morePets]);

            await db.disconnect();

            return res.status(200).json({ error: false, message: 'Las mascotas fueron cargadas' });
        }

        if (data === 'users') {
            await User.deleteMany();

            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash('123456Ab_', salt);

            const usuario = new User({
                createdAt: Date.now(),
                email: 'miguellfasanellap@gmail.com',
                isAble: true,
                isSubscribed: true,
                name: 'Miguel Fasanella',
                role: 'admin',
                password: hash,
            });

            await usuario.save();

            await db.disconnect();

            return res.status(200).json({ error: false, message: 'El usuario fue creado' });
        }

        return res.status(200).json({ error: false, message: 'Oops, la request pasó' });
    } catch (error) {
        console.log(error);
        await db.disconnect();
        return res.status(500).json({ error: true, message: "Updating pets failed. Check server's logs" });
    }

}