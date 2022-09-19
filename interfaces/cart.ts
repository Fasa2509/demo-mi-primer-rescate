import { ImageObj, Tags } from ".";

export interface ICartProduct {

    _id: string;
    name: string;
    image: ImageObj;
    price: number;
    discount?: number | undefined;
    quantity: number;
    tags: Tags[];
    slug: string;

}

export interface ShippingAddress {
    
    firstName: string;
    lastName : string;
    address  : string;
    address2?: string;
    city     : string;
    phone    : string;

}

export type ISize = 'XS'|'S'|'M'|'L'|'XL'|'XXL'|'XXXL';