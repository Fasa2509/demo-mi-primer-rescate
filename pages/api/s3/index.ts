import type { NextApiRequest, NextApiResponse } from 'next';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const region = process.env.S3_UPLOAD_REGION;
const bucketName = process.env.S3_UPLOAD_BUCKET || '';
const Bucket = bucketName;
const accessKeyId = process.env.S3_UPLOAD_KEY || '';
const secretAccessKey = process.env.S3_UPLOAD_SECRET || '';

// const s3 = new aws.S3({
//     region,
//     credentials: {
//         accessKeyId,
//         secretAccessKey,
//     },
//     signatureVersion: 'v4',
// });

type Data =
    | { url: string | null; Key: string | null; }
    | { error: boolean; message: string }

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'POST':
            return generateUploadURL(req, res);

        case 'PUT':
            return deleteObjectByKey(req, res);

        default:
            return res.status(400).json({ url: null, Key: null });
    }

}

const generateUploadURL = async (req: NextApiRequest, res: NextApiResponse) => {

    const { rscname = '' } = req.body;

    if (!rscname || typeof rscname !== 'string') return res.status(400).json({ url: null, Key: null });

    let Key = `${(() => Date.now())()}-${rscname}`;

    const params = {
        Bucket: bucketName,
        Key,
        Expires: 60,
    };

    try {
        const client = new S3Client({
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
            region,
        });

        const command = new PutObjectCommand({
            Key,
            Bucket,
        });

        // @ts-ignore
        const url = await getSignedUrl(client, command, { expiresIn: 60 });

        return res.status(200).json({ url, Key });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ url: null, Key: null });
    }
}

const deleteObjectByKey = async (req: NextApiRequest, res: NextApiResponse) => {

    const { Key = '' } = req.body;

    if (!Key || typeof Key !== 'string') return res.status(400).json({ error: true, message: 'Falta Key del objeto' });

    if (!/\.jpeg/i.test(Key) && !/\.jpg/i.test(Key) && !/\.webp/i.test(Key) && !/\.png/i.test(Key) && !/\.gif/i.test(Key))
        return res.status(400).json({ error: true, message: 'El formato de la imagen no es válido' });

    try {
        const client = new S3Client({
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
            region,
        });

        const command = new DeleteObjectCommand({
            Key,
            Bucket,
        });

        await client.send(command, { requestTimeout: 60 });

        return res.status(200).json({ error: false, message: 'La imagen fue eliminada' });
    } catch (error: unknown) {
        console.log(error);

        return res.status(400).json({ error: true, message: 'Ocurrió un error eliminando la imagen' });
    }

};
