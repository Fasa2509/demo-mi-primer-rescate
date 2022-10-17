import { ICartProduct } from ".";

export interface IOrder {
    _id            : string;
    user           : string;
    orderItems     : ICartProduct[];
    total          : number;
    isPaid         : Paid;
    shippingAddress: IAddress;
    contact        : IContact;
    createdAt      : number;
}

export interface IAddress {
    address: string;
    maps   : {
        latitude : number | null;
        longitude: number | null;
    };
}

export interface IContact {
    name: string;
    facebook? : string;
    instagram?: string;
    whatsapp? : string;
}

export interface IOrderInfo {
    orderId: string;
    products: ICartProduct[];
    total: number;
    isPaid: Paid;
    shippingAddress: IAddress;
    contact: IContact;
    createdAt: string;
}

export type Paid = 'paid' | 'notpaid' | 'pending';