import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth';
import { nextAuthOptions } from '../auth/[...nextauth]';

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

    const session = await unstable_getServerSession( req, res, nextAuthOptions );

    if ( !session || !session.user )
        return res.status(400).json({ error: true, message: 'Debes iniciar sesión' });
        
        // @ts-ignore
    if ( !session.user.isAdmin )
        return res.status(400).json({ error: true, message: 'Acceso denegado' }); 

    try {
        await res.revalidate( p );
        return res.status(200).json({ error: false, message: `Revalidación exitosa ${ p }` });
    } catch( error ) {
        console.log( error );
        return res.status(500).json({ error: true, message: `Error revalidando ${ p }` });
    }

}