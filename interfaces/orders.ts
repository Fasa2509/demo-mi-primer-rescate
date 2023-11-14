import { Sizes } from '.';

export type TMethod = 'Pago móvil' | 'Paypal';

export const validMethods: TMethod[] = ['Pago móvil', 'Paypal'];

export const validNumberPhones = ['412', '414', '416', '424', '426'];

export interface IOrder {

    _id: string;
    user: string;
    orderItems: IOrderProduct[];
    shippingAddress: IAddress;
    contact: IContact;
    transaction: ITransaction;
    createdAt: number;

}

export type Paid = 'send' | 'paid' | 'notpaid' | 'pending';

export const SpanishOrderStatus = {
    send: 'Enviada',
    paid: 'Pagada',
    notpaid: 'No pagada',
    pending: 'Pendiente',
};

export const StatusColors = {
    send: 'var(--main-color-hover)',
    paid: 'var(--success-color)',
    pending: 'var(--warning-color)',
    notpaid: 'var(--error-color)',
};

export interface ITransaction {

    status: Paid;
    transactionId: string;
    method: TMethod;
    phone: string;
    totalUSD: number;
    paidUSD: number;
    totalBs: number;

}

export interface IOrderProduct {

    _id: string;
    name: string;
    price: number;
    discount: number;
    quantity: number;
    size: Sizes;
    slug: string;

}

export interface IAddress {
    address: string;
    maps: {
        latitude: number | null;
        longitude: number | null;
    };
}

export interface IContact {
    name: string;
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
}