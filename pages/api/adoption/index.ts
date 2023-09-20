import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth/next";
import { nextAuthOptions } from '../auth/[...nextauth]';
import { isValidObjectId } from 'mongoose';
import { db } from '../../../database';
import { Adoption } from '../../../models';
import { ApiResponse, ApiResponsePayload } from '../../../mprApi';
import { IAdoption, adminRoles } from '../../../interfaces';

type Data =
    | ApiResponse
    | ApiResponsePayload<{ adoptions: IAdoption[] }>;

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getPaginatedAdoptions(req, res);

        case 'POST':
            return createAdoption(req, res);

        case 'PUT':
            return checkAdoption(req, res);

        default:
            return res.status(400).json({ error: true, message: 'BAD REQUEST' });
    }

}

const getPaginatedAdoptions = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    try {
        let { p } = req.query;

        if (!p || isNaN(Number(p))) throw { msg: 'La paginación no es válida' };

        let page = Number(p);

        const session = await getServerSession(req, res, nextAuthOptions);

        if (!session || !session.user || !adminRoles.includes(session.user.role!)) return res.status(400).json({ error: true, message: 'No tiene permiso para realizar esta acción' });

        await db.connect();

        const adoptions = await Adoption.find().skip(page * 20).limit(20).sort({ createdAt: -1 }).lean();

        await db.disconnect();

        return res.status(200).json({ error: false, message: adoptions.length > 0 ? 'Adopciones obtenidas' : 'No se encontraron más adopciones', payload: { adoptions } });
    } catch (error: any) {
        console.log(error);

        if (error && typeof error === 'object' && error.msg) return res.status(400).json({ error: true, message: error.msg });

        return res.status(500).json({ error: true, message: 'Ocurrió un error obteniendo las adopciones' });
    }

}

const createAdoption = async (req: NextApiRequest, res: NextApiResponse) => {

    const session = await getServerSession(req, res, nextAuthOptions);

    if (!session || !session.user)
        return res.status(400).json({ error: true, message: 'Debes iniciar sesión' });

    try {
        await db.connect();

        // @ts-ignore
        const adoption = new Adoption({ ...req.body, user: session.user._id });
        await adoption.save();

        await db.disconnect();

        return res.status(200).json({ error: false, message: 'La petición de adopción fue creada' });
    } catch (error) {
        console.log(error);
        await db.disconnect();
        return res.status(500).json({ error: true, message: 'Ocurrió un error en la DB' });
    }

}

const checkAdoption = async (req: NextApiRequest, res: NextApiResponse) => {

    const { _id } = req.body;

    if (!_id || !isValidObjectId(_id))
        return res.status(400).json({ error: true, message: 'El id no es válido' });

    const session = await getServerSession(req, res, nextAuthOptions);

    const validRoles = ['superuser', 'admin'];

    // @ts-ignore
    if (!session || !session.user || !validRoles.includes(session.user.role))
        return res.status(400).json({ error: true, message: 'Acceso denegado' });

    try {
        await db.connect();

        const adoption = await Adoption.findById(_id);

        if (!adoption) {
            await db.disconnect();
            return res.status(400).json({ error: true, message: 'No se encontró la petición' });
        }

        adoption.checked = true;
        await adoption.save();

        await db.disconnect();

        return res.status(200).json({ error: false, message: 'La petición fue actualizada' });
    } catch (error) {
        console.log(error);
        await db.disconnect();
        return res.status(400).json({ error: true, message: 'Ócurrio un error accediendo a la DB' });
    }

}
