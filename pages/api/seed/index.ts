import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth';
import { db } from '../../../database';
import { allProducts, adoptionPets, otherPets } from '../../../interfaces';
import { Pet, Product } from '../../../models';
import { nextAuthOptions } from '../auth/[...nextauth]';

type Data =
| { error: boolean; message: string }

const validSeeds = [
    'products',
    'pets',
]

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    if ( req.method !== 'GET' ) return res.status(400).json({ error: true, message: "BAD REQUEST" });
    if ( !req.query.data ) return res.status(400).json({ error: true, message: 'Debes indicar lo que vas a cargar a la DB' });
    if ( !validSeeds.includes( req.query.data.toString() ) ) return res.status(400).json({ error: true, message: 'Esa query no existe' });

    if ( req.query.data ) return updateProducts( req, res );

    return res.status(201).json({ error: false, message: 'No hay data' })

}

const updateProducts = async ( req: NextApiRequest, res: NextApiResponse ) => {

    const { data } = req.query;

    const session = await unstable_getServerSession( req, res, nextAuthOptions );

    if ( !session || !session.user )
        return res.status(400).json({ error: true, message: 'Debes iniciar sesión' });
        
        // @ts-ignore
    if ( !session.user.isAdmin )
        return res.status(400).json({ error: true, message: 'Acceso denegado' }); 

    try {
        await db.connect();

        if ( data === 'products' ) {
            await Product.deleteMany();
    
            const actualProducts = allProducts.map(( product ) => {
                let { _id, ...p } = product;
                return p;
            });
            
            await Product.insertMany( actualProducts );

            await db.disconnect();

            return res.status(200).json({ error: false, message: 'Los productos fueron cargados' });
        }
        
        if ( data === 'pets' ) {
            await Pet.deleteMany();
    
            const actualPets = adoptionPets.map(( pet ) => {
                let { _id, ...p } = pet;
                return p;
            });

            const morePets = otherPets.map(( pet ) => {
                let { _id, ...p } = pet;
                return p;
            });
            
            await Pet.insertMany([...actualPets, ...morePets]);

            await db.disconnect();

            return res.status(200).json({ error: false, message: 'Las mascotas fueron cargadas' });
        }
        
        return res.status(200).json({ error: false, message: 'Oops, la request pasó' });
    } catch( error ) {
        console.log( error );
        await db.disconnect();
        return res.status(500).json({ error: true, message: "Updating pets failed. Check server's logs" });
    }

}