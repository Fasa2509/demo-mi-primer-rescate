import { Sizes } from '.';

export interface IOrder {

    _id            : string;
    user           : string;
    orderItems     : IOrderProduct[];
    total          : number;
    isPaid         : Paid;
    shippingAddress: IAddress;
    contact        : IContact;
    createdAt      : number;
    
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

export interface IOrderInfo {

    orderId        : string;
    products       : IOrderProduct[];
    total          : number;
    isPaid         : Paid;
    shippingAddress: IAddress;
    contact        : IContact;
    createdAt      : string;

}

export type Paid = 'paid' | 'notpaid' | 'pending';