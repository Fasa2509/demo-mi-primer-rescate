import type { NextApiRequest, NextApiResponse } from 'next'
// import { uploadImage } from '../../../utils'

type Data =
| { message: string }

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {

    switch ( req.method ) {
        case 'GET':

            return res.status(200).json({ message: 'Bien ahi' })
        
        case 'POST':

            return upload( req, res )
    
        default:

            return res.status(400).json({ message: 'Cambia el metodo' })
    }
    
}

const upload = async ( req: any, res: any ) => {


    try {
        console.log('inicio')
        // await uploadImage( req, res )
        console.log('fin')

        console.log(req)

        return res.status(200).json({
            // imageId: req.file.id,
            // imageName: req.file.filename,
            message: 'Exito subiendo la imagen',
        })
    } catch( error ) {
        console.log(error)
        return res.status(400).json({ message: 'Ocurrio un error subiendo la imagen' })
    }

}
