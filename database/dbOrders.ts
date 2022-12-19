import axios from 'axios';
import { db } from '.';
import { Order } from '../models';
import { mprApi } from '../mprApi';
import { IAddress, ICartProduct, IContact, IOrder, Paid } from '../interfaces';

export const getUserOrders = async ( userId: string ): Promise<IOrder[]> => {

    if ( !userId ) return [];

    try {
        await db.connect();
        
        const orders = await Order.find({ user: userId });

        await db.disconnect();

        return JSON.parse( JSON.stringify( orders.sort((a: IOrder, b: IOrder) => b.createdAt - a.createdAt) ) );
    } catch( error ) {
        console.log( error );

        return [];
    }

}

export const updatePaidOrder = async ( orderId: string = '', orderStatus: Paid = 'pending' ): Promise<{ error: boolean; message: string }> => {

    if ( !orderId ) return { error: true, message: 'Falta info de la orden' };

    try {
        const { data } = await mprApi.put( `/order/${ orderId }?status=${ orderStatus }` );

        return data;
    } catch( error ) {
        console.log( error );

        if ( axios.isAxiosError( error ) ) {
            return {
                error: true,
                // @ts-ignore
                message: error.response ? error.response.data.message : 'Ocurrió un error actualizando la órden',
            }
        }

        return {
            error: true,
            message: 'Error',
        };
    }

}

export const createNewOrder = async ({ userId, cart, shippingAddress, contact, transaction }: { userId: string, cart: ICartProduct[], shippingAddress: IAddress, contact: IContact, transaction: { transactionId: string; method: string; phone: string; } }): Promise<{ error: boolean; message: string; }> => {

    if ( !userId || cart.length < 1 || shippingAddress.address.length < 4  || Object.values( shippingAddress.maps ).filter(d => d).length < 2 || Object.values( contact ).filter(c => c).length < 2 ) return { error: true, message: 'Falta información de la orden' };

    try {
        const { data } = await mprApi.post('/order', {
            user: userId,
            orderItems: cart.map(({ _id, name, price, discount, quantity, size, slug }) => ({ _id, name, price, discount, quantity, size, slug })),
            shippingAddress,
            contact,
            transaction,
        });

        return data;
    } catch( error: any ) {
        console.log( error );

        if ( axios.isAxiosError( error ) ) {
            return {
                error: true,
                // @ts-ignore
                message: error.response ? error.response.data.message : 'Ocurrió un error creando la órden',
            }
        }

        return {
            error: true,
            message: 'Error',
        };
    }

}

export const getAllOrders = async (): Promise<IOrder[] | null> => {

    try {
        await db.connect();

        const orders: IOrder[] = await Order.find().sort({ createdAt: -1 }).limit( 100 );

        await db.disconnect();

        return JSON.parse( JSON.stringify( orders ) );
    } catch( error ) {
        console.log( error );
        return null;
    }

}