import { ImageObj, Tags } from ".";
import { Sizes } from './products';

export interface ICartProduct {

    _id        : string;
    name       : string;
    image      : ImageObj;
    price      : number;
    discount   : number;
    quantity   : number;
    size       : Sizes;
    maxQuantity: number;
    tags       : Tags[];
    slug       : string;

}

export interface ICartProductInfo {

    _id: string;
    name: string;
    price: number;
    discount: number;
    quantity: number;
    size: Sizes;
    slug: string;

}