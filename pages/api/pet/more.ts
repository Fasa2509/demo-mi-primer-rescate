import type { NextApiRequest, NextApiResponse } from 'next';
import { ApiResponse, ApiResponsePayload } from '../../../mprApi';
import { IPet, adminRoles } from '../../../interfaces';
import { getServerSession } from 'next-auth';
import { nextAuthOptions } from '../auth/[...nextauth]';
import { db } from '../../../database';
import { Pet } from '../../../models';

type Data =
    | ApiResponse
    | ApiResponsePayload<{ pets: IPet[] }>;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getPaginatedPets(req, res);

        default:
            return res.status(200).json({ error: true, message: 'BAD REQUEST!' });
    }

}

const getPaginatedPets = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    try {
        let { p } = req.query;

        if (!p || isNaN(Number(p))) throw { msg: 'La paginación no es válida' };

        let page = Number(p);

        const session = await getServerSession(req, res, nextAuthOptions);

        if (!session || !session.user || !adminRoles.includes(session.user.role!)) return res.status(400).json({ error: true, message: 'No tiene permiso para realizar esta acción' });

        await db.connect();

        const pets = await Pet.find().skip(page * 20).limit(20).sort({ createdAt: -1 }).lean();

        await db.disconnect();

        return res.status(200).json({ error: false, message: pets.length > 0 ? 'Mascotas obtenidas' : 'No se encontraron más mascotas', payload: { pets } });
    } catch (error: any) {
        console.log(error);

        if (error && typeof error === 'object' && error.msg) return res.status(400).json({ error: true, message: error.msg });

        return res.status(500).json({ error: true, message: 'Ocurrió un error obteniendo las adopciones' });
    }

}