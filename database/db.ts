import mongoose from 'mongoose';
const { connections, connect: mongooseConnect, disconnect: mongooseDisconnect } = mongoose;

/*
    0 = disconnected
    1 = connected
    2 = connecting
    3 = disconnecting
*/

const mongoConnection = {
    isConnected: 0
}

export const connect = async () => {

    if ( mongoConnection.isConnected === 1 ) {
        console.log('Ya estabamos conectados')
        return;
    }

    if ( connections.length > 1 ) {
        mongoConnection.isConnected === connections[0].readyState

        if ( mongoConnection.isConnected === 1 ) {
            console.log('Usando conexion anterior')
            return;
        }

        await mongooseDisconnect()
    }

    await mongooseConnect( process.env.MONGO_URI || '' )
    mongoConnection.isConnected = 1
    console.log('Conectado a MongoDB:', process.env.MONGO_URI)
}

export const disconnect = async () => {

    // if ( process.env.NODE_ENV === 'development' ) return

    if ( mongoConnection.isConnected === 0 ) return

    await mongooseDisconnect();
    mongoConnection.isConnected = 0;

    console.log('Desconectando de MongoDB');
}