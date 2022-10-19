import type { NextApiRequest, NextApiResponse } from 'next'

type Data =
| { error: boolean; message: string; }

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    if ( req.method === 'GET' ) {
        return revalidatePage( req, res );
    } else {
        return res.status(400).json({ error: true, message: 'BAD REQUEST' })
    }

}

const revalidatePage = async ( req: NextApiRequest, res: NextApiResponse ) => {

    if ( !req.query.secret || req.query.secret?.toString() !== process.env.NEXT_PUBLIC_SECRET_REVALIDATE ) return res.status(403).json({ error: true, message: 'No tienes permiso para llamar a esta api' });
    if ( !req.query.p ) return res.status(400).json({ error: true, message: 'Debes enviar una página a revalidar' });

    try {
        await res.revalidate(req.query.p.toString());
        return res.status(200).json({ error: false, message: 'Revalidation success' });
    } catch( error ) {
        console.log( error );
        return res.status(500).json({ error: true, message: "Revalidation failed. Check server's logs" });
    }

}