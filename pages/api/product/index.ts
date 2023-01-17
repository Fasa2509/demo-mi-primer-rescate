import { isValidObjectId } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth';
import { nextAuthOptions } from '../auth/[...nextauth]';
import { db } from '../../../database';
import { Product } from '../../../models';

type Data =
| { error: boolean; message: string; }

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch( req.method ) {
        case 'POST':
            return createNewProduct( req, res );

        case 'PUT':
            return updateProductInfo( req, res );
                
        case 'DELETE':
            return switchProductAbility( req, res );

        default:
            return res.status(400).json({ error: true, message: 'BAD REQUEST' });
    }

}

const createNewProduct = async ( req: NextApiRequest, res: NextApiResponse ) => {

    const { name = '', description = '', images = [], inStock, price = 0, discount, tags = [], slug = '', unica = undefined } = req.body;

    if ( !name || !description || images.length < 2 || images.length > 4 || price === 0 || discount > 50 || tags.length === 0 || !slug.startsWith('/') || unica === undefined )
        return res.status(400).json({ error: true, message: 'La información no es válida' });
        
    const { unique, ...tallas } = inStock;

    if ( unique !== -1 && Object.values( tallas ).some(( value ) => typeof value === 'number' && value > 0) )
        return res.status(400).json({ error: true, message: 'La cantidad de tallas no es válida' });

    const session = await unstable_getServerSession( req, res, nextAuthOptions );

    if ( !session || !session.user )
        return res.status(400).json({ error: true, message: 'Debes iniciar sesión' });
            
    const validRoles = ['superuser', 'admin'];
        
        // @ts-ignore
    if ( !validRoles.includes( session.user.role ) )
        return res.status(400).json({ error: true, message: 'Acceso denegado' });    

    try {
        await db.connect();

        const product = new Product({
            name,
            description,
            images,
            inStock:
                ( unica )
                ? {
                    unique: inStock.unique,
                    S: 0,
                    M: 0,
                    L: 0,
                    XL: 0,
                    XXL: 0,
                    XXXL: 0
                }
                : {
                    ...inStock,
                    unique: -1,
                },
            price,
            discount: discount > 1 ? discount / 100 : discount,
            tags,
            slug,
        });

        await product.save();

        await db.disconnect();
        
        return res.status(200).json({ error: false, message: 'El producto fue creado' });
    } catch( error ) {
        console.log( error );
        await db.disconnect();
        return res.status(500).json({ error: true, message: 'Ocurrió un error accediendo a la DB'});
    }

}

const updateProductInfo = async ( req: NextApiRequest, res: NextApiResponse ) => {

    const { id = '' } = req.query;
    const { name = '', description = '', images = [], price = 0, discount = 0, inStock, tags = [], unique: unica = undefined } = req.body;
    const { unique = 0, S = 0, M = 0, L = 0, XL = 0, XXL = 0, XXXL = 0 } = inStock;

    const session = await unstable_getServerSession( req, res, nextAuthOptions );

    if ( !session || !session.user )
        return res.status(400).json({ error: true, message: 'Debes iniciar sesión' });

    const validRoles = ['superuser', 'admin'];
        
        // @ts-ignore
    if ( !validRoles.includes( session.user.role ) )
        return res.status(400).json({ error: true, message: 'Acceso denegado' });    

    if ( !isValidObjectId( id ) ) return res.status(400).json({ error: true, message: 'El id no es válido' });

    if ( !name || !description || price === 0 || discount > 50 || discount < 0 || unica === undefined )
        return res.status(400).json({ error: true, message: 'La información no es válida' });
    
    if ( tags.length === 0 || tags.length > 4 )
        return res.status(400).json({ error: true, message: 'Se necesita al menos una etiqueta' });

    if ( images.length < 2 || images.length > 4 )
        return res.status(400).json({ error: true, message: 'Mínimo 2 imágenes y máximo 4' });
        
    let { unique: u, ...tallas } = inStock;
        
    try {
        await db.connect();
        
        if ( unica ) {
            const product = await Product.findById( id );

            if ( !product ) {
                await db.disconnect();
                return res.status(400).json({ error: true, message: 'No existe product con ese id' });
            }
            
            if ( product.inStock.unique !== -1 && Object.values( tallas ).some(( value ) => typeof value === 'number' && value > 0) ) {
                await db.disconnect();
                return res.status(400).json({ error: true, message: 'Error en la info de las tallas' });
            }

            if ( product.inStock.unique === -1 && inStock.unique >= 0 ) {
                await db.disconnect();
                return res.status(400).json({ error: true, message: 'Error en la info de las tallas' });
            }
            
            product.name = name;
            product.description = description;
            product.images = [...images];
            product.price = price;
            product.discount = ( discount > 0.5 ) ? discount / 100 : discount;
            
            ( unique < 0 && Math.abs( unique ) > product.inStock.unique )
                ? product.inStock.unique = 0
                : product.inStock.unique += unique
            product.inStock.S = 0;
            product.inStock.M = 0;
            product.inStock.L = 0;
            product.inStock.XL = 0;
            product.inStock.XXL = 0;
            product.inStock.XXXL = 0;
            
            product.tags = [...tags];
            await product.save();
        } else {
            const product = await Product.findById( id );
            if ( !product ) {
                await db.disconnect();
                return res.status(400).json({ error: true, message: 'No existe producto con ese id' });
            }
            
            if ( product.inStock.unique !== -1 && Object.values( tallas ).some(( value, index, array ) => typeof value === 'number' && value > 0) ) {
                await db.disconnect();   
                return res.status(400).json({ error: true, message: 'Error en la info de las tallas' });
            }
            if ( product.inStock.unique === -1 && inStock.unique >= 0 ) {
                await db.disconnect();   
                return res.status(400).json({ error: true, message: 'Error en la info de las tallasssss' });
            }

            product.name = name;
            product.description = description;
            product.price = price;
            product.discount = discount / 100;
            
            product.inStock.unique = -1;
            
            product.inStock.S = ( S < 0 && Math.abs( S ) > product.inStock.S! ) ? 0 : product.inStock.S! + S;
            product.inStock.M = ( M < 0 && Math.abs( M ) > product.inStock.M! ) ? 0 : product.inStock.M! + M;
            product.inStock.L = ( L < 0 && Math.abs( L ) > product.inStock.L! ) ? 0 : product.inStock.L! + L;
            product.inStock.XL = ( XL < 0 && Math.abs( XL ) > product.inStock.XL! ) ? 0 : product.inStock.XL! + XL;
            product.inStock.XXL = ( XXL < 0 && Math.abs( XXL ) > product.inStock.XXL! ) ? 0 : product.inStock.XXL! + XXL;
            product.inStock.XXXL = ( XXXL < 0 && Math.abs( XXXL ) > product.inStock.XXXL! ) ? 0 : product.inStock.XXXL! + XXXL;

            product.tags = [...tags];
            await product.save();
        }

        await db.disconnect();
        return res.status(200).json({ error: false, message: 'El producto fue actualizado' });
    } catch( error ) {
        console.log( error );
        await db.disconnect();
        return res.status(400).json({ error: true, message: 'Ocurrió un error actualizando el producto' });
    }

}

const switchProductAbility = async ( req: NextApiRequest, res: NextApiResponse ) => {
    
    const { id = '' } = req.query;

    if ( !isValidObjectId( id ) ) return res.status(400).json({ error: true, message: 'El id no es válido' });

    try {
        await db.connect();
        
        const product = await Product.findById( id );
        
        if ( !product ) {
            await db.disconnect();
            return res.status(400).json({ error: true, message: 'No existe product con ese id' });
        }

        product.isAble = !product.isAble;
        await product.save();
        
        await db.disconnect();

        return res.status(200).json({ error: false, message: `El producto fue ${ product.isAble ? 'habilitado' : 'eliminado' }` });
    } catch( error ) {
        console.log( error );
        await db.disconnect();
        return res.status(500).json({ error: true, message: 'Ocurrió un error en la DB' });
    }

}
