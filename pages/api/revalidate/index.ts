import type { NextApiRequest, NextApiResponse } from 'next'

type Data =
| { error: boolean; message: string; }

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    if ( req.method === 'POST' ) {
        return revalidatePage( req, res );
    } else {
        return res.status(400).json({ error: true, message: 'BAD REQUEST' })
    }

}

const revalidatePage = async ( req: NextApiRequest, res: NextApiResponse ) => {

    const { p = '', secret = '' } = req.body;

    if ( !p.startsWith('/') || secret !== process.env.NEXT_PUBLIC_SECRET_REVALIDATE ) return res.status(403).json({ error: true, message: 'No tienes permiso para llamar a esta api' });

    try {
        await res.revalidate( p );
        return res.status(200).json({ error: false, message: `La página ${ p } fue revalidada` });
    } catch( error ) {
        console.log( error );
        return res.status(500).json({ error: true, message: `Error revalidando ${ p }` });
    }

}