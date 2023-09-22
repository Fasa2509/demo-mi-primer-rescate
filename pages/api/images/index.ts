import { isValidObjectId } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { IndexSection } from '../../../models';
import { IIndexImage } from '../../../interfaces';
import { nextAuthOptions } from '../auth/[...nextauth]';
import { getServerSession } from 'next-auth';

type Data =
    | { error: boolean; message: string; }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'POST':
            return saveIndexSections(req, res);

        case 'DELETE':
            return deleteIndexSection(req, res);

        default:
            return res.status(400).json({ error: true, message: 'BAD REQUEST!' });
    }

}


const saveIndexSections = async (req: NextApiRequest, res: NextApiResponse) => {

    const { sections } = req.body as { sections: IIndexImage[] };

    if (!sections || !(sections instanceof Array) || sections.some((sec) => (sec.bgcolor && (!sec.content)) || (sec.link && !sec.linkText)))
        return res.status(400).json({ error: true, message: 'Falta información de algunas imágenes' });

    if (sections.length < 1)
        return res.status(400).json({ error: true, message: 'Debe haber por lo menos una imagen' });

    const session = await getServerSession(req, res, nextAuthOptions);

    if (!session || !session.user || session.user.role !== 'admin') return res.status(400).json({ error: true, message: 'No tienes permiso para realizar esta tarea' });

    try {
        await db.connect();

        await IndexSection.deleteMany();

        await new IndexSection({ sections: sections.map(({ _id, ...sec }) => ({ ...sec })) }).save();

        await db.disconnect();

        return res.status(200).json({ error: false, message: '¡Las imágenes fueron guardadas!' });
    } catch (error) {
        console.log(error);
        await db.disconnect();
        return res.status(500).json({ error: true, message: 'Ocurrió un error guardando las imágenes en la DB' });
    }

}


const deleteIndexSection = async (req: NextApiRequest, res: NextApiResponse) => {

    const { id } = req.query;

    if (!isValidObjectId(id)) return res.status(400).json({ error: true, message: 'El id de la imagen no es válido' });

    const session = await getServerSession(req, res, nextAuthOptions);

    if (!session || !session.user || session.user.role !== 'admin') return res.status(400).json({ error: true, message: 'No tienes permiso para realizar esta tarea' });

    try {
        await db.connect();

        const indexSection = await IndexSection.findOne();

        if (!indexSection) return res.status(400).json({ error: true, message: 'No se encontró una sección' });

        indexSection.sections = indexSection.sections.filter((sec) => sec._id.toString() !== id);

        await indexSection.save();

        await db.disconnect();

        return res.status(200).json({ error: false, message: 'La imagen fue eliminada' });
    } catch (error) {
        await db.disconnect();

        return res.status(500).json({ error: true, message: 'Ocurrió un error eliminando la imagen' });
    }

}