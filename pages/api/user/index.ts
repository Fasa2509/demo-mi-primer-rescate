import type { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse, ApiResponsePayload } from "../../../mprApi";
import { getServerSession } from "next-auth";
import { db } from "../../../database";
import { User } from "../../../models";
import { nextAuthOptions } from "../auth/[...nextauth]";
import { IUser, adminRoles } from "../../../interfaces";

type Data =
    | ApiResponse
    | ApiResponsePayload<{ users: IUser[] }>;

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getPaginatedUsers(req, res);

        default:
            return res.status(400).json({ error: true, message: 'Method not allowed' });
    }

};

const getPaginatedUsers = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    try {
        let { p } = req.query;

        if (!p || isNaN(Number(p))) throw { msg: 'La paginación no es válida' };

        let page = Number(p);

        const session = await getServerSession(req, res, nextAuthOptions);

        // @ts-ignore
        if (!session || !adminRoles.includes(session?.user.role)) return res.status(400).json({ error: true, message: 'No tiene permiso para realizar esta acción' });

        await db.connect();

        const users = await User.find().skip(page * 20).limit(20).sort({ createdAt: -1 }).lean();

        await db.disconnect();

        return res.status(200).json({ error: false, message: users.length > 0 ? 'Usuarios obtenidos' : 'No se encontraron más usuarios', payload: { users } });
    } catch (error: any) {
        console.log(error);

        if (error && typeof error === 'object' && error.msg) return res.status(400).json({ error: true, message: error.msg });

        return res.status(500).json({ error: true, message: 'Ocurrió un error obteniendo los usuarios' });
    }
}

