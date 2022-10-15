import jwt from 'jsonwebtoken';

export const signToken = ( _id: string, email: string ): string => {

    if ( !process.env.JWT_SECRET_SEED ) {
        throw new Error('No hay semilla en .env. Revisar variables de entorno')
    }

    return jwt.sign(
        // payload
        { _id, email },

        // seed
        process.env.JWT_SECRET_SEED,

        // options
        { expiresIn: '1d' }
    )

}

export const isValidToken = ( token: string ): Promise<string> => {
    
    if ( !process.env.JWT_SECRET_SEED ) {
        throw new Error('No hay semilla en .env. Revisar variables de entorno')
    }

    if ( token.length <= 10 ) return Promise.reject('JWT no es valido')

    return new Promise( (resolve, reject) => {
        try {
            jwt.verify( token, process.env.JWT_SECRET_SEED!, (err, payload) =>{
                if ( err ) return reject('JWT no es valido!')

                const { _id } = payload as { _id: string }

                resolve( _id )
            })
        } catch( error ) {
            reject('JWT no es valido!')
        }
    })
}