import { Sizes } from '.';

export interface IOrder {

    _id            : string;
    user           : string;
    orderItems     : IOrderProduct[];
    shippingAddress: IAddress;
    contact        : IContact;
    transaction    : ITransaction;
    createdAt      : number;
    
}

export type Paid = 'send' | 'paid' | 'notpaid' | 'pending';

export const SpanishOrderStatus = {
    send: 'Enviada',
    paid: 'Pagada',
    notpaid: 'No pagada',
    pending: 'Pendiente',
};

export const StatusColors = {
    send: 'secondary',
    paid: 'success',
    pending: 'warning',
    notpaid: 'error',
};

export type TMethod = 'Pago móvil' | 'Paypal';

export interface ITransaction {
    status: Paid;
    transactionId: string;
    method: TMethod;
    totalUSD: number;
    totalBs: number;
}

export interface IOrderProduct {
    
    _id     : string;
    name    : string;
    price   : number;
    discount: number;
    quantity: number;
    size    : Sizes;
    slug    : string;

}

export interface IAddress {
    address: string;
    maps   : {
        latitude : number | null;
        longitude: number | null;
    };
}

export interface IContact {
    name      : string;
    facebook? : string;
    instagram?: string;
    whatsapp? : string;
}

// export interface IOrderInfo {

//     orderId        : string;
//     products       : IOrderProduct[];
//     total          : number;
//     isPaid         : Paid;
//     shippingAddress: IAddress;
//     contact        : IContact;
//     transactionId  : string;
//     createdAt      : string;

// }