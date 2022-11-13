import axios from 'axios';
import { db } from '.';
import { Order } from '../models';
import { mprApi } from '../mprApi';
import { IAddress, ICartProduct, IContact, IOrder, Paid } from '../interfaces';

export const updatePaidOrder = async ( orderId: string = '', orderStatus: Paid = 'pending' ): Promise<{ error: boolean; message: string }> => {

    if ( !orderId ) return { error: true, message: 'Falta info de la orden' };

    try {
        const { data } = await mprApi.put( `/order/${orderId}?status=${ orderStatus }` );

        return data;
    } catch( error ) {
        console.log( error );

        if ( axios.isAxiosError( error ) ) {
            return {
                error: true,
                // @ts-ignore
                message: error.response ? error.response.data.message : 'Ocurrió un error actualizando la orden',
            }
        }

        return {
            error: true,
            message: 'Error',
        };
    }

}

export const createNewOrder = async ( userId: string, cart: ICartProduct[], total: number, shippingAddress: IAddress, contact: IContact ): Promise<{ error: boolean; message: string; }> => {
    
    if ( !userId || cart.length < 1 || total === 0 || shippingAddress.address.length < 5  || Object.values( shippingAddress.maps ).filter(d => d).length < 2 || Object.values( contact ).filter(c => c).length < 1 ) return { error: true, message: 'Falta información de la orden' };
    
    if ( total < cart.reduce(( prev, { quantity, price, discount } ) => prev + quantity * ( price * ( 1 - discount ) ), 0) - 0.1 )
        return { error: true, message: 'Error creando la orden' };

    try {
        const { data } = await mprApi.post('/order', {
            user: userId,
            orderItems: cart.map(({ _id, name, price, discount, quantity, size, slug }) => ({ _id, name, price, discount, quantity, size, slug })),
            total,
            isPaid: 'pending',
            shippingAddress,
            contact,
        });

        return data;
    } catch( error: any ) {
        console.log( error );

        if ( axios.isAxiosError( error ) ) {
            return {
                error: true,
                // @ts-ignore
                message: error.response ? error.response.data.message : 'Ocurrió un error creando la orden',
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

        const orders: IOrder[] = await Order.find();

        await db.disconnect();

        return JSON.parse( JSON.stringify( orders.sort((a: IOrder, b: IOrder) => b.createdAt - a.createdAt) ) );
    } catch( error ) {
        console.log( error );
        return null;
    }

}